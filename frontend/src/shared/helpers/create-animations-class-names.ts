export function createAnimationClassNames(
  name: string,
  classes: {
    readonly [key: string]: string;
  }
) {
  return {
    enter: classes[`${name}-enter`],
    enterActive: classes[`${name}-enter-active`],
    enterDone: classes[`${name}-enter-done`],
    exit: classes[`${name}-exit`],
    exitActive: classes[`${name}-exit-active`],
    exitDone: classes[`${name}-exit-done`],
  };
}
