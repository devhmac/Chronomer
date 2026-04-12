/**
 * Check if a Slate/Plate node tree contains any non-empty text.
 * Used by both the note-block renderer (to show/hide visual treatment)
 * and the editor sync (to skip empty blocks when writing to the store).
 */
export function hasTextContent(children: any[]): boolean {
  for (const node of children) {
    if (node.text !== undefined && node.text.trim() !== '') {
      return true;
    }
    if (node.children && hasTextContent(node.children)) {
      return true;
    }
  }
  return false;
}
