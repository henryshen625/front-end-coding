// Promise.myRace = function (args) {
//     return new Promise((resolve, reject) => {
//         for (let i = 0, len = args.length; i < len; i++) {
//             args[i].then(resolve, reject);
//         }
//     }) 
// }

// const promise1 = new Promise((resolve, reject) => setTimeout(resolve, 500, 'promise1'));
// const promise2 = new Promise((resolve, reject) => setTimeout(resolve, 100, 'promise2'));
// const promise3 = new Promise((resolve, reject) => setTimeout(reject, 300, 'promise3'));

// 测试最先完成的 promise 被解析
// Promise.myRace([promise1, promise2, promise3]).then((result) => {
//     console.log(result); // 应输出 'promise2'
// }).catch((error) => {
//     console.log(error);
// });

// const promise4 = new Promise((resolve, reject) => setTimeout(reject, 50, 'promise4'));

// 测试最先拒绝的 promise 被拒绝
// Promise.myRace([promise1, promise3, promise4]).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error); // 应输出 'promise4'
// });

// 测试混合解析和拒绝的 promise，确保最先的结果被使用
// Promise.myRace([promise3, promise2, promise1]).then((result) => {
//     console.log(result); // 应输出 'promise2'
// }).catch((error) => {
//     console.log(error);
// });


//这个函数跟上面的区别就是 他可以把传递进来的任意变量包装成promise 再返回出去 上面只能接受promise的array
function promiseRace(iterable) {
    return new Promise((resolve, reject) => {
        if (iterable.length === 0) {
            return;
        }

        for (let index = 0; index < iterable.length; index++) {
            Promise.resolve(iterable[index]).then(resolve, reject);
        }
    })
}

const p0 = new Promise((resolve) => {
    setTimeout(() => {
      resolve(42);
    }, 100);
  });
  const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Err!');
    }, 400);
  });
  
  promiseRace([p0, p1]).then(val => {
    console.log(val);
  }); // 42