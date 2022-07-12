import { findParentElement } from './find-parent-element';

export function getNearestScroll(element: HTMLElement | null): HTMLElement | null {
  return findParentElement(element, (parent) => {
    const computedStyle = window.getComputedStyle(parent);

    return (
      computedStyle &&
      (computedStyle.getPropertyValue('overflow') === 'auto' || computedStyle.getPropertyValue('overflow') === 'scroll')
    );
  });
}
