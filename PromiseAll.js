function myPromiseAll(params) {
    let res, rej;
    const p = new Promise((resolve, reject) => {
        //多次失败 不会反复调用reject reject只有在第一次调用的时候有效
        //状态一旦确定下来 就不能更改
        res = resolve;
        rej = reject;
    })
    let i = 0;
    let fullfilled = 0;
    const result = [];
    for (const prom of params) {
        const index = i;
        i ++;
        Promise.resolve(prom).then((data) => {
            // 1.完成的数据汇总到最终的结果
            result[index] = data;
            // 2. 判定是否全部完成
            fullfilled++;
            if (fullfilled === i) {
                res(result);
            }
        }, rej);
    }
    if (i === 0) {
        res([]);
    }
    return p;
}

let p1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(1)
    }, 1000)
})
let p2 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2)
    }, 2000)
})
let p3 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(3)
    }, 3000)
})

myPromiseAll([1, 2, 3, Promise.resolve(123), Promise.reject(456)]).then(
    (res) => {
        console.log(res);
    },
    (err) => {
        console.log('err', err);
    }
)
