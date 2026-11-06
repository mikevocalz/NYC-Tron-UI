/**
 * Options under a visible heading, as a select or dropdown shows them. Used by
 * `Select` (`@nyc-tron/ui/components/Select`) and `NativeDropdown`
 * (`@nyc-tron/expo-controls/NativeDropdown`) through their `groups` prop.
 */
export interface OptionGroup<T>{
  /** Section header text; read by screen readers as the group's name. Must not be blank. */
  readonly heading:string;
  /** The group's options, in order. A group needs at least one. */
  readonly options:readonly T[];
}

/** The options of every group in display order, for keyboard order, lookup and validation. */
export function flattenOptionGroups<T>(groups:readonly OptionGroup<T>[]):T[]{
  return groups.flatMap(group=>group.options);
}

/**
 * Throws a TypeError for a group that cannot be shown honestly: a blank
 * heading or no options. Option-level rules (unique values, labels) stay with
 * each component's own validation over {@linkcode flattenOptionGroups}.
 */
export function validateOptionGroups<T>(groups:readonly OptionGroup<T>[]):void{
  for(const group of groups){
    if(typeof group.heading!=="string"||!group.heading.trim())throw new TypeError("Option group headings must not be blank");
    if(!Array.isArray(group.options)||group.options.length===0)
      throw new TypeError("Option group \""+group.heading+"\" has no options");
  }
}
