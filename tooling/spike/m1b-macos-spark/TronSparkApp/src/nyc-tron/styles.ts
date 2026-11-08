/**
 * Tailwind classes are merged at the APP boundary. Joining without
 * tailwind-merge avoids deleting custom typography/color utilities that
 * depend on each consumer's own @theme configuration.
 */
export function joinClasses(...items: Array<string|false|null|undefined>):string {
  return items.filter(Boolean).join(" ");
}
