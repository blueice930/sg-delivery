export const timeout = (ms: number) => (
  new Promise((res) => setTimeout(() => {
    console.log(`slept ${ms} ms`);
    res(null);
  }, ms))
);
