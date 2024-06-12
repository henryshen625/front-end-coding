function promiseTimeout(promise, duration) {
    return new Promise((resolve, reject) => {
        const timerId = setTimeout(() => {
            reject('Promise timeout');
        }, duration);

        promise.then(resolve).catch(reject).finally(() => {
            clearTimeout(timerId)
        });
    })
}

function fakeFetch(latency) {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation that resolves after `latency`.
      setTimeout(() => {
        resolve('Data successfully fetched!');
      }, latency);
    });
  }
  
  const response = promiseTimeout(fakeFetch(1000), 2000).then(val => console.log(val)).catch(err => console.log(err));
  console.log(response); // Data successfully fetched!
  
promiseTimeout(fakeFetch(5000), 2000);