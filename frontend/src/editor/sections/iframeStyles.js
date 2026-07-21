// Clones the parent document's stylesheets (Tailwind's compiled output + any webfont
// links) into the preview iframe's own document, since a srcDoc iframe starts with none
// of the parent's CSS. Works for both Vite dev (injected <style> tags) and a prod build
// (hashed <link rel="stylesheet"> tags) without needing to know which mode is active.
export function syncStylesIntoIframe(iframeDoc) {
  const nodes = document.head.querySelectorAll('style, link[rel="stylesheet"]');
  nodes.forEach((node) => {
    if (iframeDoc.head.querySelector(`[data-nova-cloned-from="${node.outerHTML.length}-${nodeKey(node)}"]`)) return;
    const clone = node.cloneNode(true);
    clone.setAttribute('data-nova-cloned-from', `${node.outerHTML.length}-${nodeKey(node)}`);
    iframeDoc.head.appendChild(clone);
  });
}

function nodeKey(node) {
  return node.tagName === 'LINK' ? node.getAttribute('href') : 'inline-style';
}
