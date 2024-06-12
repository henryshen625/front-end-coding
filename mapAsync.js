function mapAsync(iterable, callBack) {
    // return Promise.all(iterable.map(callbackFn));
    return new Promise((resolve, reject) => {
        const result = new Array(iterable.length);
        let unresolved = iterable.length;

        if (unresolved === 0) {
            resolve(result);
            return;
        }

        iterable.forEach((item, index) => {
            callBack(item)
                .then(val => {
                    result[index] = val;
                    unresolved--;
                    if (unresolved === 0) {
                        resolve(result);
                    }
                }).catch(err => {
                    reject(err);
                })
        });
    })
}

const asyncDouble = (x) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(x * 2);
      }, 10);
    });
  
  const doubled = await mapAsync([1, 2], asyncDouble);
  console.log(doubled); // [2, 4]