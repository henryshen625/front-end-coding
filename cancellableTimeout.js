function cancellableTimeout(callBack, delay, ...args) {
    let timer = setTimeout(callBack, delay, ...args);

    return () => {
        clearTimeout(timer);
    }
}


let i = 0;
// t = 0:
const cancel = cancellableTimeout(() => {
  i++;
}, 100);
// t = 50:
cancel();
// t = 100: i is still 0 because cancel() was called.