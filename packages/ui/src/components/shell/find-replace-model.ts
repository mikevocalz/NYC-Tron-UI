export interface FindDocument { readonly id: string; readonly revision: string }
export interface FindQuery {
  readonly document: FindDocument;
  readonly text: string;
  readonly caseSensitive: boolean;
  readonly wholeWord: boolean;
}
export interface FindMatch {
  readonly id: string;
  /** UTF-16 offsets, matching React Native text selection. */
  readonly start: number;
  readonly end: number;
  readonly before: string;
  readonly text: string;
  readonly after: string;
}
export interface FindResponse { readonly token: string; readonly total: number; readonly matches: readonly FindMatch[] }
export type ReplaceRequest = {
  readonly query: FindQuery;
  readonly searchToken: string;
  readonly replacement: string;
} & ({ readonly kind: "one"; readonly matchId: string } | { readonly kind: "all" });
const expression = (query: FindQuery) => new RegExp(query.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), query.caseSensitive ? "gu" : "giu");
const wordBoundary = (text: string, start: number, end: number) =>
  !/[\p{L}\p{N}\p{M}_]$/u.test(text.slice(Math.max(0, start - 2), start)) && !/^[\p{L}\p{N}\p{M}_]/u.test(text.slice(end, end + 2));
export const literalSearchToken = (query: FindQuery): string => JSON.stringify([query.document.id, query.document.revision, query.text, query.caseSensitive, query.wholeWord]);

export function validateFindResponse(response: FindResponse): void {
  if (!response.token || !Number.isSafeInteger(response.total) || response.total < response.matches.length || response.matches.length > 1000 || (response.total > 0 && !response.matches.length)) throw new RangeError("Find responses need a token, total, and at most 1000 visible matches");
  let end = -1;
  const ids = new Set<string>();
  for (const match of response.matches) {
    if (!match.id || ids.has(match.id) || !Number.isSafeInteger(match.start) || !Number.isSafeInteger(match.end) || match.start < 0 || match.end <= match.start || match.start < end) throw new RangeError("Find matches need distinct IDs and ordered nonoverlapping UTF-16 ranges");
    if (match.before.length > 120 || match.after.length > 120 || match.text.length > 4096) throw new RangeError("Find preview context exceeds its display budget");
    ids.add(match.id); end = match.end;
  }
}
/** Optional literal provider for short text documents. Large/indexed documents supply their own provider. */
export function findLiteralText(text: string, query: FindQuery, limit = 1000): FindResponse {
  if (text.length > 1_000_000 || query.text.length > 256) throw new RangeError("Use an indexed provider for text over one million characters or queries over 256 characters");
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) throw new RangeError("Find display limit must be in 1...1000");
  const matches: FindMatch[] = [];
  let total = 0;
  if (query.text) for (const result of text.matchAll(expression(query))) {
    const start = result.index, end = start + result[0].length;
    if (query.wholeWord && !wordBoundary(text, start, end)) continue;
    total++;
    if (matches.length < limit) matches.push({ id: `${start}:${end}`, start, end, before: text.slice(Math.max(0, start - 40), start), text: result[0], after: text.slice(end, end + 40) });
  }
  return { token: literalSearchToken(query), total, matches };
}
/** Literal replacement, including literal dollar signs. The host commits its result once. */
export function replaceLiteralText(document: FindDocument & { readonly text: string }, request: ReplaceRequest): string {
  if (request.query.document.id !== document.id || request.query.document.revision !== document.revision || request.searchToken !== literalSearchToken(request.query)) throw Error("The document or search changed; find again before replacing");
  if (document.text.length > 1_000_000 || request.query.text.length > 256 || request.replacement.length > 4096) throw new RangeError("Literal replacement exceeds the short-document provider budget");
  if (!request.query.text) return document.text;
  let replaced = false;
  const next = document.text.replace(expression(request.query), (value: string, start: number) => {
    const end = start + value.length;
    if (request.query.wholeWord && !wordBoundary(document.text, start, end)) return value;
    if (request.kind === "one" && `${start}:${end}` !== request.matchId) return value;
    replaced = true;
    return request.replacement;
  });
  if (request.kind === "one" && !replaced) throw Error("The selected match no longer exists");
  if (next.length > 1_000_000) throw new RangeError("Replacement exceeds the short-document provider budget");
  return next;
}
