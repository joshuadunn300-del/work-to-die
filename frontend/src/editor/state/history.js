// Simple linear undo/redo stack. push() drops any redo tail (standard editor behaviour).
export function createHistory(initial) {
  return { past: [], present: initial, future: [] };
}

export function push(hist, next) {
  return { past: [...hist.past, hist.present], present: next, future: [] };
}

export function undo(hist) {
  if (hist.past.length === 0) return hist;
  const previous = hist.past[hist.past.length - 1];
  return {
    past: hist.past.slice(0, -1),
    present: previous,
    future: [hist.present, ...hist.future],
  };
}

export function redo(hist) {
  if (hist.future.length === 0) return hist;
  const [next, ...rest] = hist.future;
  return { past: [...hist.past, hist.present], present: next, future: rest };
}

export const canUndo = (hist) => hist.past.length > 0;
export const canRedo = (hist) => hist.future.length > 0;

function demo() {
  let h = createHistory('a');
  h = push(h, 'b');
  h = push(h, 'c');
  console.assert(h.present === 'c', 'push failed');
  h = undo(h);
  console.assert(h.present === 'b', 'undo failed');
  h = undo(h);
  console.assert(h.present === 'a', 'undo x2 failed');
  console.assert(canUndo(h) === false, 'should be out of undo history');
  h = redo(h);
  h = redo(h);
  console.assert(h.present === 'c', 'redo chain failed');
  h = undo(h);
  h = push(h, 'z'); // new edit after undo must drop redo tail
  console.assert(canRedo(h) === false, 'redo tail should be cleared after new edit');
  console.log('history demo: OK');
}

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) demo();
