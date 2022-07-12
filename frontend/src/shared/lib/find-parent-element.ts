export function findParentElement(
  element: HTMLElement | null,
  predicate: (element: HTMLElement) => boolean
): HTMLElement | null {
  const find = (element: HTMLElement | null, predicate: (element: HTMLElement) => boolean): HTMLElement | null => {
    if (!element) {
      return null;
    }

    if (predicate(element)) {
      return element;
    }

    return find(element.parentElement, predicate);
  };

  if (!element) {
    return null;
  }

  return find(element.parentElement, predicate);
}
