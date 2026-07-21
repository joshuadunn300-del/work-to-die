// Spread onto any text element to make it directly editable in the live editor's iframe.
// No-op (empty object) when `editable` is false, so section components render identically
// in the read-only renderer (fixtures, publish) and the editor preview.
export function editableProps(editable, path) {
  if (!editable) return {}
  return { contentEditable: true, suppressContentEditableWarning: true, 'data-edit-path': path }
}
