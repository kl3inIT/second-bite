/** A row of a two-level list, such as a category under its group or a floor under its mall. */
export type TreeItem = { id: string; parentId?: string };

/**
 * The rows of a tree as a table shows them (Figma AD-CD1, AD-CD2): each top row followed by its own rows, in the
 * order given, with how deep each sits. A row whose parent is not in the list is shown at the top.
 */
export function flattenTree<Item extends TreeItem>(items: Item[]): (Item & { depth: number })[] {
  const ids = new Set(items.map((item) => item.id));
  const childrenOf = new Map<string, Item[]>();
  const roots: Item[] = [];
  for (const item of items) {
    if (item.parentId && ids.has(item.parentId) && item.parentId !== item.id) {
      childrenOf.set(item.parentId, [...(childrenOf.get(item.parentId) ?? []), item]);
    } else {
      roots.push(item);
    }
  }
  const rows: (Item & { depth: number })[] = [];
  const visit = (item: Item, depth: number) => {
    rows.push({ ...item, depth });
    for (const child of childrenOf.get(item.id) ?? []) visit(child, depth + 1);
  };
  for (const root of roots) visit(root, 0);
  return rows;
}
