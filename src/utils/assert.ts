export function assertExists<T>(object: T | undefined | null, message = 'Is not defined'): asserts object is T {
  if (object === undefined || object === null) {
    throw Error(message);
  }
}
