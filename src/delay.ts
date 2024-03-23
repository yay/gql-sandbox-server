export function delayFor(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });
}

export function delay() {
  return delayFor(1000);
}
