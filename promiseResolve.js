function promiseResolve(value) {
    if (value instanceof Promise) {
        return value;
    }
    return new Promise((resolve) => resolve(value));
}



//Test:
const resolvedThenable = promiseResolve({
    then(resolve, reject) {
      resolve(42);
    },
  });


resolvedThenable.then(val => console.log(val)); // 42