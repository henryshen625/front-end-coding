/*
有N个人，每个人都可以送礼物和收礼物。三条限制：
1. 每个收礼人只有一个送礼人 
2: 每个送礼人只能送一个收礼人 
3. 不能自己给自己送礼。
写一个function做这个assignment，来match送礼人和收礼人。
*/

/**
 * 为一组人生成无自送（derangement）的送礼分配。
 * @param {string[]} people - 人员列表
 * @returns {{from: string, to: string}[]} 分配列表
 */
function assignGifts(people) {
  const N = people.length;
  // 用索引表示每个人
  const indices = Array.from({ length: N }, (_, i) => i);

  // 使用 Sattolo 算法生成单循环置换
  for (let i = N - 1; i > 0; i--) {
    // 在 [0, i-1] 范围内选一个 j
    const j = Math.floor(Math.random() * i);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // 构造最终的配对：i → indices[i]
  return people.map((giver, i) => ({
    from: giver,
    to:   people[indices[i]]
  }));
}

// 测试示例
const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Jack'];
// const assignment = assignGifts(names);
// console.log(assignment);
// 可能输出：
// [ { from: 'Alice', to: 'Carol' },
//   { from: 'Bob',   to: 'Dave'  },
//   { from: 'Carol', to: 'Bob'   },
//   { from: 'Dave',  to: 'Alice' } ]


/**
 * 带历史约束的 Secret Santa 分配
 * @param {string[]} people       — 人员列表
 * @param {number[]} lastYear     — 去年分配结果，lastYear[i] 是第 i 个人去年的 receiver 下标
 * @returns {{from:string,to:string}[]}
 */
function assignGiftsWithHistory(people, lastYear) {
  const N = people.length;
  const indices = new Array(N);

  function reset() {
    for (let i = 0; i < N; i++) indices[i] = i;
  }

  // Helper: 用 Sattolo 算法打乱 indices
  function shuffle() {
    reset();
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);  // 注意 j < i
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }

  function isInValid(indices) {
    return indices.some((to, i) => to === i || to === lastYear[i]);
  }
  // 不断重试，直到“无自送”且“不撞去年”两个条件都满足
  while (isInValid(indices)) {
    shuffle();
  }

  // 构造结果
  return people.map((giver, i) => ({
    from: giver,
    to:   people[indices[i]]
  }));
}

// 举例：
// people = ['A','B','C','D']
// 假设去年 lastYear = [2,0,3,1]（即 A→C, B→A, C→D, D→B）
const people = ['A','B','C','D'];
const lastYear = [2,0,3,1];
const result = assignGiftsWithHistory(people, lastYear);
// console.log(result);



function secrectSanta(names) {
    if (names.length < 2) {
        throw new Error("Can't send gift less then 2 people");
        
    }
    const indices = Array.from({ length: names.length}, (_, index) => index);
    
    for (let i = names.length - 1; i> 0; i--) {
        const j = Math.floor(Math.random() * i);
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const firstYear = names.map((name, i) => ({
        [name]: names[indices[i]]
    }));
    return { firstYear, indices };
}

function secrectSantaWithLastYear(names, lastYear) {
    const lastYearIndex = [];
    lastYear.forEach(element => {
        const senderIndex = names.indexOf(element.from);
        const receiverIndex = names.indexOf(element.to);
        lastYearIndex[senderIndex] = receiverIndex;
    });
    const indices = Array.from({ length: names.length }, (_, index) => index);
    function reset() {
        for (let i = 0; i < indices.length; i++) {
            indices[i] = i;
        }
    }

    function shuffle() {
        reset();
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
    }

    function isInValid() {
        return indices.some((item, index) => item === index || item === lastYearIndex[index]);
    }

    while (isInValid()) {
        shuffle();
    }

    const result = names.map((name, index) => (
        {
            [name]: names[indices[index]]
        }
    ));
    return result;
}

// function secretSantaWithLastYear(names, lastYear) {
//     // 将去年送礼关系转换为 index 数组表示
//     const lastYearMap = new Array(names.length).fill(-1);
//     lastYear.forEach(({ from, to }) => {
//         const senderIndex = names.indexOf(from);
//         const receiverIndex = names.indexOf(to);
//         if (senderIndex !== -1 && receiverIndex !== -1) {
//             lastYearMap[senderIndex] = receiverIndex;
//         }
//     });

//     const indices = Array.from({ length: names.length }, (_, index) => index);

//     function reset() {
//         for (let i = 0; i < indices.length; i++) {
//             indices[i] = i;
//         }
//     }

//     function shuffle() {
//         reset();
//         for (let i = names.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * i); // j < i 保证 Sattolo 的变体
//             [indices[i], indices[j]] = [indices[j], indices[i]];
//         }
//     }

//     function isInValid() {
//         return indices.some((receiverIndex, senderIndex) => (
//             receiverIndex === senderIndex || receiverIndex === lastYearMap[senderIndex]
//         ));
//     }

//     // 重新打乱直到合法
//     do {
//         shuffle();
//     } while (isInValid());

//     // 生成最终结果
//     const result = names.map((name, index) => ({
//         from: name,
//         to: names[indices[index]]
//     }));

//     return result;
// }


const { firstYear, indices } = secrectSanta(names);
console.log(firstYear);
const secondYear = secrectSantaWithLastYear(names, firstYear);
console.log(secondYear);
