export function compose<T extends Function>(...actions: T[]): T {
  if (actions.length < 1) {
    throw new Error('No actions');
  }

  return ((...args: any[]) => {
    if (actions.length === 1) {
      return actions[0](...args);
    }

    const [action, ...other] = actions;
    return action(compose(...other)(...args));
  }) as Function as T;
}
