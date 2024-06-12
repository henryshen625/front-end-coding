function promiseAllSettled(iterable) {
    return new Promise((resolve, reject) => {
        const result = new Array(iterable.length);
        let pending = iterable.length;

        if (pending === 0) {
            resolve(result)
            return;
        }

        iterable.forEach((item, index) => {
            Promise.resolve(item).then(
                value => {
                    result[index] = {
                        status: 'fulfilled',
                        value
                    };
                },
                    reason => {
                        result[index] = {
                            staus: 'rejected',
                            reason
                        };
                    }).finally(() => {
                        pending --;
                        if (pending === 0) {
                            resolve(result);
                    }   
                }
            )
        })
    })
}