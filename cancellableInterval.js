function cancellableInterval(callBack, delay, ...args) {
    const timerId = setInterval(callBack, delay, ...args);

    return () => {
        clearInterval(timerId);
    }
}

let i = 0;
// t = 0:
const cancel = cancellableInterval(() => {
  i++;
}, 10);
// t = 10: i is 1
// t = 20: i is 2
cancel(); // Called at t = 25
// t = 30: i is still 2 because cancel() was called and the interval callback has stopped running.
