async function mergePromise(promises) {
    const data = [];
    for (let i = 0; i < promises.length; i++) {
      const result = await promises[i](); // 按顺序执行
      data.push(result); // 存储结果
    }
    return data;
}
  
async function mergePromise(promises) {
  const data = [];
  for (let i = 0; i < promises.length; i++) {
    const result = await promises[i](); // 按顺序执行
    data.push(result); // 存储结果
  }
  return data;
}
const async1 = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Task 1");
        resolve("Result 1");
      }, 1000);
    });
};
  
const async2 = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Task 2");
        resolve("Result 2");
      }, 500);
    });
};
  
const async3 = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Task 3");
        resolve("Result 3");
      }, 800);
    });
};
  
const promiseArray = [async1, async2, async3];

mergePromise(promiseArray).then((data) => {
    console.log("Final Results:", data);
});

// function mergePromise(tasks) {
//     const data = [];
//     let chain = Promise.resolve();
  
//     for (const task of tasks) {
//       chain = chain.then(() => {
//         return task().then(result => {
//           data.push(result); // 存储结果
//           console.log(result); // 输出结果
//         });
//       });
//     }
  
//     return chain.then(() => data);
//   }
  