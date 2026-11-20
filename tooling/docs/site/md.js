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
