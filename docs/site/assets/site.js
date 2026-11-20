/* Markdown subset renderer for the docs site. Input is the doc template's subset: ATX headings, paragraphs,
   pipe tables, fenced code with an info string, bullet and numbered lists (one nested level), inline code,
   bold, italics for whole-line _text_, links. Anything else renders as a paragraph. All text is escaped. */
function nycEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function nycSlug(s) {
  return String(s).toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function nycInline(s) {
  var out = "";
  var re = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  var last = 0;
  var m;
  while ((m = re.exec(s))) {
    out += nycEsc(s.slice(last, m.index));
    if (m[1] !== undefined) out += "<code>" + nycEsc(m[1]) + "</code>";
    else if (m[2] !== undefined) out += "<strong>" + nycEsc(m[2]) + "</strong>";
    else if (/^(https?:|\.{0,2}\/|#|[A-Za-z0-9_.-]+\.(md|html|txt))/.test(m[4])) out += '<a href="' + nycEsc(m[4]) + '">' + nycEsc(m[3]) + "</a>";
    else out += nycEsc(m[0]);
    last = re.lastIndex;
  }
  return out + nycEsc(s.slice(last));
}
function nycCells(line) {
  var s = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  var cells = [];
  var cur = "";
  var tick = false;
  for (var k = 0; k < s.length; k++) {
    var c = s[k];
    if (c === "\\" && s[k + 1] === "|") { cur += "|"; k++; }
    else if (c === "`") { tick = !tick; cur += c; }
    else if (c === "|" && !tick) { cells.push(cur.trim()); cur = ""; }
    else cur += c;
  }
  cells.push(cur.trim());
  return cells;
}
function nycTable(rows, cls) {
  var head = nycCells(rows[0]);
  var h = "<div class=\"tw\"><table class=\"" + cls + "\"><thead><tr>" + head.map(function (c) { return "<th scope=\"col\">" + nycInline(c) + "</th>"; }).join("") + "</tr></thead><tbody>";
  for (var i = 2; i < rows.length; i++) {
    var cs = nycCells(rows[i]);
    h += "<tr>" + cs.map(function (c, j) { return "<td data-label=\"" + nycEsc(head[j] || "") + "\">" + nycInline(c) + "</td>"; }).join("") + "</tr>";
  }
  return h + "</tbody></table></div>";
}
/* renderMarkdown(md, opts) -> html. opts.idPrefix prefixes heading ids; opts.codeCopy adds a Copy button to code blocks. */
function renderMarkdown(md, opts) {
  opts = opts || {};
  var lines = md.replace(/\r/g, "").split("\n");
  var out = [];
  var i = 0;
  var codeN = 0;
  while (i < lines.length) {
    var l = lines[i];
    if (/^```/.test(l)) {
      var info = l.slice(3).trim();
      var buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      var id = "code-" + (opts.idPrefix || "") + (codeN++);
      var lang = info.split(" ")[0];
      out.push("<div class=\"cb\">" + (opts.codeCopy ? "<button type=\"button\" class=\"btn\" data-copy-target=\"" + id + "\">Copy</button>" : "") + "<pre><code id=\"" + id + "\"" + (lang ? " data-lang=\"" + nycEsc(lang) + "\"" : "") + ">" + nycEsc(buf.join("\n")) + "</code></pre></div>");
      continue;
    }
    var hm = l.match(/^(#{1,6}) (.+)$/);
    if (hm) {
      var n = Math.min(hm[1].length + (opts.shift || 0), 6);
      out.push("<h" + n + " id=\"" + (opts.idPrefix || "") + nycSlug(hm[2]) + "\">" + nycInline(hm[2]) + "</h" + n + ">");
      i++;
      continue;
    }
    if (/^\s*\|/.test(l) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      var rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      out.push(nycTable(rows, opts.stack === false ? "" : "stack"));
      continue;
    }
    if (/^(\s*)([-*]|\d+\.) /.test(l)) {
      var ordered = /^\s*\d+\./.test(l);
      var items = [];
      while (i < lines.length && (/^(\s*)([-*]|\d+\.) /.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        var mm = lines[i].match(/^(\s*)(?:[-*]|\d+\.) (.*)$/);
        if (mm) {
          if (mm[1].length >= 2 && items.length) items[items.length - 1].sub.push(mm[2]);
          else items.push({t: mm[2], sub: []});
        } else items[items.length - 1].t += " " + lines[i].trim();
        i++;
      }
      var tag = ordered ? "ol" : "ul";
      out.push("<" + tag + ">" + items.map(function (it) {
        return "<li>" + nycInline(it.t) + (it.sub.length ? "<ul>" + it.sub.map(function (x) { return "<li>" + nycInline(x) + "</li>"; }).join("") + "</ul>" : "") + "</li>";
      }).join("") + "</" + tag + ">");
      continue;
    }
    if (l.trim() === "") { i++; continue; }
    var para = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(```|#{1,6} |\s*\||(\s*)([-*]|\d+\.) )/.test(lines[i])) para.push(lines[i++]);
    if (!para.length) para.push(lines[i++]);
    var text = para.join(" ");
    if (text === "_Not documented._") out.push("<p class=\"empty-note\">Not documented.</p>");
    else out.push("<p>" + nycInline(text) + "</p>");
  }
  return out.join("\n");
}

/* NYC-Tron UI docs site script. Builds on md.js (concatenated ahead of this file by build-site.mjs).
   Everything here is progressive: each page is readable without it except the component page body, which
   is rendered from assets/pages.js and links to the raw markdown in a <noscript> block. */
(function () {
  "use strict";
  var D = document;
  var R = D.documentElement;
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
    return null;
  }
  var live = $("#live");
  function say(t) { if (live) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); } }

  /* ---- theme control ---- */
  var THEMES = ["reference", "infrax"];
  var SCHEMES = ["auto", "light", "dark"];
  var NAMES = {reference: "Reference", infrax: "InFraX", auto: "Auto", light: "Light", dark: "Dark"};
  function curTheme() { return R.getAttribute("data-theme") || "reference"; }
  function curScheme() { return R.getAttribute("data-scheme") || "auto"; }
  function paint() {
    $$("[data-cycle]").forEach(function (b) {
      var k = b.getAttribute("data-cycle");
      var v = NAMES[k === "theme" ? curTheme() : curScheme()];
      b.textContent = v;
      b.setAttribute("aria-label", (k === "theme" ? "Theme: " : "Mode: ") + v + ". Press to change.");
    });
    $$("[data-theme-set]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === curTheme())); });
    $$("[data-scheme-set]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-scheme-set") === curScheme())); });
    var css = $("[data-theme-css]");
    if (css) css.textContent = themeCss();
  }
  function setTheme(t) { R.setAttribute("data-theme", t); store("nyc-docs-theme", t); paint(); say("Theme " + NAMES[t]); }
  function setScheme(s) { R.setAttribute("data-scheme", s); store("nyc-docs-scheme", s); paint(); say("Mode " + NAMES[s]); }
  $$("[data-cycle]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-cycle") === "theme") setTheme(THEMES[(THEMES.indexOf(curTheme()) + 1) % THEMES.length]);
      else setScheme(SCHEMES[(SCHEMES.indexOf(curScheme()) + 1) % SCHEMES.length]);
    });
  });
  $$("[data-theme-set]").forEach(function (b) { b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme-set")); }); });
  $$("[data-scheme-set]").forEach(function (b) { b.addEventListener("click", function () { setScheme(b.getAttribute("data-scheme-set")); }); });
  function isDark() {
    var s = curScheme();
    return s === "dark" || (s === "auto" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  }
  var VARS = ["primary", "on-primary", "surface-raised", "surface-sunken", "border", "text", "text-muted", "danger", "on-danger", "accent", "info", "success", "focus"];
  function themeCss() {
    var cs = getComputedStyle(R);
    var lines = VARS.map(function (v) { return "  --color-" + v + ": " + cs.getPropertyValue("--color-" + v).trim() + ";"; });
    lines.push("  --radius-control: " + cs.getPropertyValue("--radius-control").trim() + ";");
    lines.push("  --radius-card: " + cs.getPropertyValue("--radius-card").trim() + ";");
    return "@theme {\n" + lines.join("\n") + "\n}\n/* " + NAMES[curTheme()] + ", " + (isDark() ? "dark" : "light") + " */";
  }
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paint);
  paint();

  /* ---- copy ---- */
  function fallbackCopy(text, btn) {
    var ta = D.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    D.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = D.execCommand("copy"); } catch (e) { ok = false; }
    D.body.removeChild(ta);
    return ok;
  }
  function doCopy(text, btn) {
    var label = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", label);
    function done() {
      btn.textContent = "Copied";
      say("Copied");
      setTimeout(function () { btn.textContent = label; }, 2000);
    }
    function manual() {
      var ok = fallbackCopy(text, btn);
      if (ok) return done();
      say("Copy failed. The text is selected below. Press Command C or Control C to copy it.");
      var pre = D.createElement("pre");
      pre.className = "manual";
      pre.textContent = text;
      var note = D.createElement("p");
      note.className = "small muted";
      note.textContent = "Press Cmd+C or Ctrl+C to copy the selected text.";
      btn.parentNode.insertBefore(note, btn.nextSibling);
      note.parentNode.insertBefore(pre, note.nextSibling);
      var r = D.createRange();
      r.selectNodeContents(pre);
      var sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, manual);
    else manual();
  }
  D.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-copy],[data-copy-target],[data-copy-agent]");
    if (!b) return;
    var text;
    if (b.hasAttribute("data-copy")) text = b.getAttribute("data-copy");
    else if (b.hasAttribute("data-copy-target")) text = D.getElementById(b.getAttribute("data-copy-target")).textContent;
    else text = window.__agentText ? window.__agentText() : "";
    doCopy(text, b);
  });

  /* ---- offline notice ---- */
  function net() {
    var off = navigator.onLine === false;
    $$("[data-offline]").forEach(function (n) { n.hidden = !off; });
  }
  window.addEventListener("online", net);
  window.addEventListener("offline", net);
  net();

  /* ---- menu open on desktop ---- */
  var nav = $("details.navbox");
  if (nav && window.matchMedia) {
    var mq = matchMedia("(min-width: 1100px)");
    var sync = function () { if (mq.matches) nav.setAttribute("open", ""); };
    sync();
    mq.addEventListener("change", sync);
  }

  /* ---- BM25 (same scorer as docs/agent-native/retrieval-eval.mjs) ---- */
  var STOP = {};
  "a an the for of to and or with in on at by is it that this as from into using use need want i my me our".split(" ").forEach(function (w) { STOP[w] = 1; });
  function stem(w) {
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 4 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 3 && /(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function toks(s) {
    return s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").toLowerCase().split(/[^a-z0-9]+/).filter(function (w) { return w && !STOP[w]; }).map(stem);
  }
  function buildIndex(docs) {
    var rows = docs.map(function (d) {
      var t = toks(d.t + " " + d.d);
      var tf = {};
      t.forEach(function (w) { tf[w] = (tf[w] || 0) + 1; });
      return {id: d.i, len: t.length, tf: tf};
    });
    var N = rows.length;
    var avg = rows.reduce(function (a, r) { return a + r.len; }, 0) / N;
    var df = {};
    rows.forEach(function (r) { Object.keys(r.tf).forEach(function (w) { df[w] = (df[w] || 0) + 1; }); });
    return {rows: rows, N: N, avg: avg, df: df};
  }
  function rank(ix, q) {
    var qt = toks(q).filter(function (w, i, a) { return a.indexOf(w) === i; });
    var out = [];
    ix.rows.forEach(function (r) {
      var s = 0;
      var hit = 0;
      qt.forEach(function (w) {
        var f = r.tf[w];
        if (!f) return;
        hit++;
        var n = ix.df[w];
        s += (Math.log(1 + (ix.N - n + 0.5) / (n + 0.5)) * f * 2.2) / (f + 1.2 * (0.25 + (0.75 * r.len) / ix.avg));
      });
      if (s > 0) out.push({id: r.id, s: s, m: hit, of: qt.length});
    });
    return out.sort(function (a, b) { return b.s - a.s || (a.id < b.id ? -1 : 1); });
  }

  /* ---- search page ---- */
  var sp = $("[data-search-page]");
  if (sp) {
    var list = $("#results");
    var lis = $$("li[data-id]", list);
    var byId = {};
    var docs = lis.map(function (li) {
      byId[li.getAttribute("data-id")] = li;
      return {i: li.getAttribute("data-id"), t: li.getAttribute("data-t"), d: li.getAttribute("data-d")};
    });
    var ix = buildIndex(docs);
    var flat = D.createElement("ul");
    flat.className = "rows";
    flat.id = "flat";
    flat.hidden = true;
    list.insertBefore(flat, list.firstChild);
    lis.forEach(function (li) { li._home = li.parentNode; });
    var qf = $("#q"), tierf = $("#tier"), catf = $("#cat"), platf = $("#plat");
    var count = $("#count"), emptyBox = $("#empty"), errBox = $("#err"), selId = null;
    var params = new URLSearchParams(location.search);
    qf.value = params.get("q") || "";
    tierf.value = params.get("tier") || "";
    catf.value = params.get("category") || "";
    platf.value = params.get("platform") || "";
    $$(".nojs").forEach(function (n) { n.hidden = true; });
    function match(li) {
      if (tierf.value && li.getAttribute("data-k") !== tierf.value) return false;
      if (catf.value && li.getAttribute("data-c") !== catf.value) return false;
      if (platf.value && (" " + li.getAttribute("data-p") + " ").indexOf(" " + platf.value + " ") < 0) return false;
      return true;
    }
    function run(pushState) {
      var q = qf.value.trim();
      var order;
      var ranked = q ? rank(ix, q) : [];
      var stat = {};
      ranked.forEach(function (r) { stat[r.id] = r; });
      if (q) order = ranked.map(function (r) { return r.id; });
      else order = lis.map(function (li) { return li.getAttribute("data-id"); });
      lis.forEach(function (li) {
        var old = $(".hl", li);
        if (old) old.parentNode.removeChild(old);
      });
      var shown = 0;
      var grp = {};
      lis.forEach(function (li) { li.hidden = true; if (li.parentNode === flat) li._home.appendChild(li); });
      $$("[data-group]").forEach(function (g) { g.hidden = true; });
      flat.hidden = !q;
      order.forEach(function (id) {
        var li = byId[id];
        if (!li || !match(li)) return;
        li.hidden = false;
        shown++;
        var st = stat[id];
        if (q && st && st.of > 1) {
          var tag = D.createElement("span");
          tag.className = "hl";
          tag.textContent = "Matches " + st.m + " of " + st.of + " words";
          $(".a", li).appendChild(tag);
        }
        grp[li.getAttribute("data-c")] = true;
        if (q) flat.appendChild(li);
      });
      $$("[data-group]").forEach(function (g) { g.hidden = q ? true : !grp[g.getAttribute("data-group")]; });
      var active = [tierf.value, catf.value, platf.value].filter(Boolean).length;
      $("#fcount").textContent = active ? " (" + active + " active)" : "";
      count.textContent = shown + (shown === 1 ? " result" : " results");
      emptyBox.hidden = shown !== 0;
      var wk = $("#weak");
      if (wk) {
        var best = 0;
        order.forEach(function (id) { if (byId[id] && match(byId[id]) && stat[id] && stat[id].m > best) best = stat[id].m; });
        wk.hidden = !(q && shown > 0 && ranked.length && ranked[0].of > 1 && best < ranked[0].of);
      }
      if (shown === 0) $("#emptyq").textContent = q;
      selId = null;
      $$(".sel", list).forEach(function (n) { n.classList.remove("sel"); });
      if (pushState) {
        var p = new URLSearchParams();
        if (q) p.set("q", q);
        if (tierf.value) p.set("tier", tierf.value);
        if (catf.value) p.set("category", catf.value);
        if (platf.value) p.set("platform", platf.value);
        var s = p.toString();
        try { history.replaceState(null, "", s ? "?" + s : location.pathname); } catch (e) { /* file:// may refuse */ }
      }
    }
    qf.addEventListener("input", function () { run(true); });
    [tierf, catf, platf].forEach(function (f) { f.addEventListener("change", function () { run(true); }); });
    $("#clear").addEventListener("click", function () { qf.value = ""; tierf.value = ""; catf.value = ""; platf.value = ""; run(true); qf.focus(); });
    $("form[data-search-form]").addEventListener("submit", function (e) { e.preventDefault(); run(true); });
    function visible() { return lis.filter(function (li) { return !li.hidden; }); }
    function select(li) {
      $$(".sel", list).forEach(function (n) { n.classList.remove("sel"); });
      if (!li) { selId = null; qf.removeAttribute("aria-activedescendant"); return; }
      li.classList.add("sel");
      selId = li.getAttribute("data-id");
      qf.setAttribute("aria-activedescendant", li.id);
      var vv = visible();
      say("Result " + (vv.indexOf(li) + 1) + " of " + vv.length + ": " + li.getAttribute("data-t"));
      li.scrollIntoView({block: "nearest"});
    }
    D.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && tag !== "input" && tag !== "select") { e.preventDefault(); qf.focus(); return; }
      if (e.target !== qf) return;
      var v = visible();
      var at = v.indexOf(selId ? byId[selId] : null);
      if (e.key === "ArrowDown") { e.preventDefault(); select(v[Math.min(at + 1, v.length - 1)]); }
      else if (e.key === "ArrowUp") { e.preventDefault(); select(v[Math.max(at - 1, 0)]); }
      else if (e.key === "Enter") { e.preventDefault(); var t = byId[selId] || v[0]; if (t) location.href = $("a", t).href; }
    });
    try { ix.N; run(false); } catch (err) { errBox.hidden = false; }
    if (window.matchMedia) {
      var fd = $("details.f");
      var m2 = matchMedia("(min-width: 1100px)");
      var s2 = function () { if (m2.matches && fd) fd.setAttribute("open", ""); };
      s2();
      m2.addEventListener("change", s2);
    }
  }

  /* ---- tokens page filter ---- */
  var tf = $("#tokfilter");
  if (tf) {
    var trs = $$("[data-tok]");
    var tn = $("#tokempty");
    var tnq = $("#tokq");
    var apply = function () {
      var q = tf.value.trim().toLowerCase();
      var n = 0;
      trs.forEach(function (r) { var ok = !q || r.getAttribute("data-tok").indexOf(q) >= 0; r.hidden = !ok; if (ok) n++; });
      tn.hidden = n !== 0;
      tnq.textContent = tf.value.trim();
      $("#tokall").textContent = String(trs.length);
    };
    tf.addEventListener("input", apply);
    $("#tokclear").addEventListener("click", function () { tf.value = ""; apply(); tf.focus(); });
    apply();
  }

  /* ---- component page ---- */
  var cp = $("[data-component-page]");
  if (cp) {
    var DOCS = window.NYC_DOCS;
    var id = new URLSearchParams(location.search).get("id");
    var body = $("#cbody");
    var meta = null;
    if (DOCS) DOCS.items.forEach(function (it) { if (it.i === id) meta = it; });
    if (!DOCS || !id || !meta || typeof DOCS.pages[id] !== "string") {
      var bad = $("#cerr");
      bad.hidden = false;
      $("#cerrid").textContent = id || "";
      $("#cname").textContent = "No page found";
      D.title = "No page found | NYC-Tron UI";
      body.hidden = true;
    } else {
      render(id, meta);
    }
  }
  function frontMatter(md) {
    var m = md.match(/^---\n([\s\S]*?)\n---\n/);
    var fm = {};
    if (m) m[1].split("\n").forEach(function (l) {
      var kv = l.match(/^(\w+): (.+)$/);
      if (kv) { try { fm[kv[1]] = JSON.parse(kv[2]); } catch (e) { fm[kv[1]] = kv[2]; } }
    });
    return {fm: fm, rest: m ? md.slice(m[0].length) : md};
  }
  function render(id, meta) {
    var DOCS = window.NYC_DOCS;
    var md = DOCS.pages[id];
    var parts = frontMatter(md);
    var fm = parts.fm;
    var secs = [];
    var cur = null;
    var fence = false;
    parts.rest.split("\n").forEach(function (l) {
      if (/^```/.test(l)) fence = !fence;
      var h = !fence && l.match(/^## (.+)$/);
      if (h) { cur = {title: h[1], lines: []}; secs.push(cur); }
      else if (cur) cur.lines.push(l);
    });
    D.title = fm.name + " | NYC-Tron UI";
    $("#cname").textContent = fm.name;
    var crumb = $("#ccrumb");
    crumb.innerHTML = "<a href=\"index.html\">Components</a> / <a href=\"search.html?category=" + nycEsc(fm.category) + "\">" + nycEsc(fm.category) + "</a> / " + nycEsc(fm.name);
    var facts = $("#cfacts");
    var a = fm.a11yStatus;
    var li = function (cls, t) { return "<li class=\"" + cls + "\">" + nycEsc(t) + "</li>"; };
    facts.innerHTML = li(fm.docs === "handwritten" ? "hr" : "", fm.docs === "handwritten" ? "Hand-reviewed" : "Generated page")
      + li(a === "reviewed-fail" ? "bad" : a === "reviewed-pass" ? "ok" : "", "Accessibility: " + a)
      + li("", fm.platforms.length ? "Platforms: " + fm.platforms.join(", ") : "Platforms: not stated in source")
      + li("", "Tier " + fm.tier);
    var cmd = "npx shadcn@latest add @nyc-tron/" + id;
    var imp = (md.match(/^- Import: `(.+)`$/m) || [0, ""])[1];
    $("#cinst").hidden = false;
    $("#cact").hidden = false;
    var cn = $("#cnote");
    if (cn && cn.textContent.trim()) cn.hidden = false;
    $("#ccmd").textContent = cmd;
    $("#ccopy").setAttribute("data-copy", cmd);
    var rawRel = "../components/" + id + ".md";
    var rawAbs = DOCS.rawBase + "/docs/components/" + id + ".md";
    $("#craw").setAttribute("href", rawRel);
    var alt = D.createElement("link");
    alt.rel = "alternate";
    alt.type = "text/markdown";
    alt.href = rawRel;
    D.head.appendChild(alt);
    /* sections */
    var html = "";
    var toc = [];
    secs.forEach(function (s) {
      var text = s.lines.join("\n").replace(/^\n+|\n+$/g, "");
      var slug = nycSlug(s.title);
      toc.push([slug, s.title]);
      html += "<section aria-labelledby=\"" + slug + "\"><h2 id=\"" + slug + "\">" + nycEsc(s.title) + "</h2>";
      if (text === "_Not documented._") {
        html += "<p class=\"empty-note\">Not documented.</p>" + (fm.docs === "generated" ? "<p class=\"small muted\">This page is generated. Edit <code>docs/components/" + nycEsc(id) + ".md</code>, set <code>docs</code> to <code>handwritten</code> in the front matter and remove the markers to add this section.</p>" : "");
      } else html += renderMarkdown(text, {codeCopy: s.title === "Example", idPrefix: slug + "-"});
      html += "</section>";
    });
    /* tokens strip */
    var tk = fm.tokens || [];
    toc.push(["tokens-used", "Tokens used"]);
    html += "<section aria-labelledby=\"tokens-used\"><h2 id=\"tokens-used\">Tokens used</h2>";
    if (!tk.length) html += "<p class=\"empty-note\">The source uses no theme token.</p>";
    else {
      html += "<p class=\"small muted\">Colours below follow the active theme. This strip stands in for a live preview, which a static site cannot render.</p><ul class=\"chips\">";
      tk.forEach(function (t) {
        var m = t.match(/^color\.(\w+)$/);
        var v = m ? "var(--color-" + m[1].replace(/[A-Z]/g, function (c) { return "-" + c.toLowerCase(); }) + ")" : null;
        var r = t.match(/^radius\.(control|card)$/);
        html += "<li>" + (v ? "<span class=\"sw\" style=\"background:" + v + "\"></span>" : r ? "<span class=\"sw\" style=\"background:var(--color-surface-sunken);border-radius:var(--radius-" + r[1] + ")\"></span>" : "") + nycEsc(t) + "</li>";
      });
      html += "</ul>";
    }
    html += "</section>";
    var rd = fm.registryDependencies || [];
    if (rd.length) {
      toc.push(["related", "Related"]);
      html += "<section aria-labelledby=\"related\"><h2 id=\"related\">Related</h2><ul>" + rd.map(function (d) { var did = d.replace(/^@nyc-tron\//, ""); return "<li><a href=\"c.html?id=" + encodeURIComponent(did).replace(/%2F/g, "/") + "\">" + nycEsc(did) + "</a></li>"; }).join("") + "</ul></section>";
    }
    body.innerHTML = html;
    /* rail */
    $("#crail").innerHTML = "<p class=\"navh\">On this page</p>" + toc.map(function (t) { return "<a href=\"#" + t[0] + "\">" + nycEsc(t[1]) + "</a>"; }).join("");
    /* nav: categories and siblings */
    var cats = {};
    DOCS.items.forEach(function (it) { cats[it.c] = (cats[it.c] || 0) + 1; });
    var nh = "<p class=\"navh\">Categories</p><ul class=\"navlist\">" + Object.keys(cats).sort().map(function (c) { return "<li><a href=\"search.html?category=" + c + "\"" + (c === fm.category ? " aria-current=\"true\"" : "") + ">" + nycEsc(c) + " <span class=\"muted small\">&nbsp;" + cats[c] + "</span></a></li>"; }).join("") + "</ul>";
    var sib = DOCS.items.filter(function (it) { return it.c === fm.category; });
    var link = function (it) { return "<li><a href=\"c.html?id=" + it.i + "\"" + (it.i === id ? " aria-current=\"page\"" : "") + ">" + nycEsc(it.n) + "</a></li>"; };
    nh += "<p class=\"navh\">In " + nycEsc(fm.category) + "</p>";
    /* A category of hundreds of pages is split by the folder after the category folder, and only the group that holds
       this page starts open. Small categories stay one flat list. */
    var groupOf = function (it) { var p = it.i.split("/"); return p.length > 2 ? p[1] : "general"; };
    if (sib.length > 40) {
      var gs = {};
      var order = [];
      sib.forEach(function (it) { var g = groupOf(it); if (!gs[g]) { gs[g] = []; order.push(g); } gs[g].push(it); });
      order.sort(function (a, b) { return a === "general" ? -1 : b === "general" ? 1 : a < b ? -1 : 1; });
      var mine = groupOf({i: id});
      order.forEach(function (g) {
        nh += "<details class=\"navgrp\"" + (g === mine ? " open" : "") + "><summary><span>" + nycEsc(g) + "</span><span class=\"muted\">" + gs[g].length + "</span></summary><ul class=\"navlist\">" + gs[g].map(link).join("") + "</ul></details>";
      });
    } else nh += "<ul class=\"navlist\">" + sib.map(link).join("") + "</ul>";
    $("#cnav").innerHTML = nh;
    var cur2 = $("#cnav a[aria-current=\"page\"]");
    if (cur2 && cur2.scrollIntoView) { var box = $("#cnav").parentNode; try { box.scrollTop = Math.max(0, cur2.offsetTop - 120); } catch (e) { /* ignore */ } }
    /* pager */
    var ix2 = sib.findIndex(function (it) { return it.i === id; });
    var pg = "";
    if (ix2 > 0) pg += "<a href=\"c.html?id=" + sib[ix2 - 1].i + "\">Previous: " + nycEsc(sib[ix2 - 1].n) + "</a>";
    else pg += "<span></span>";
    if (ix2 < sib.length - 1) pg += "<a href=\"c.html?id=" + sib[ix2 + 1].i + "\">Next: " + nycEsc(sib[ix2 + 1].n) + "</a>";
    $("#cpager").innerHTML = pg;
    /* copy for agent */
    window.__agentText = function () {
      var props = "";
      secs.forEach(function (s) { if (s.title === "Props") { props = s.lines.join("\n").split(/\n### /)[0].trim(); if (props.length > 4000) props = props.slice(0, 4000).replace(/\n[^\n]*$/, "") + "\n(Props table cut at 4000 characters. Full page: " + rawAbs + ")"; } });
      return "NYC-Tron UI item: " + id + "\nInstall: " + cmd + "\nImport: " + imp + "\nPage (raw markdown): " + rawAbs + "\nDocs: " + fm.docs + ", accessibility " + a + "\n\nProps:\n" + props + "\n";
    };
    if (location.hash) { var t = D.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }
  /* ---- scrollable regions reachable by keyboard (WCAG 2.1.1) ---- */
  function scrollables() {
    $$("pre,.tw").forEach(function (n) {
      var wide = n.scrollWidth > n.clientWidth + 1;
      if (wide && !n.hasAttribute("tabindex")) {
        n.setAttribute("tabindex", "0");
        if (n.className === "tw") { n.setAttribute("role", "region"); n.setAttribute("aria-label", "Table, scrolls sideways"); }
      } else if (!wide && n.getAttribute("data-sc") === "1") { n.removeAttribute("tabindex"); }
      if (wide) n.setAttribute("data-sc", "1");
    });
  }
  window.addEventListener("resize", scrollables);
  window.addEventListener("load", scrollables);
  setTimeout(scrollables, 0);
})();
