// debounce
function debounce(func, wait = 0) {
    let timeoutId = null;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // Has the same `this` as the outer function's as it's within an arrow function.
            timeoutId = null;
            func.apply(this, args);
        }, wait);
    }
}

// Test case
let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.
//  Call debouncedIncrement() again.
debouncedIncrement(); // i = 0

// t = 100: i is still 0 because it has only
//  been 50ms since the last debouncedIncrement() at t = 50.

// t = 150: Because 100ms have passed since
//  the last debouncedIncrement() at t = 50,
//  increment was invoked and i is now 1 .



// throttle 立即执行
function throttle(func, wait) {
    let throttling = false;
    return function(...args) {
        if (throttling) {
            return;
        }
        throttling = true;
        setTimeout(() => {
        // Has the same `this` as the outer function's
        // as it's within an arrow function.
            throttling = false;
        }, wait);
        func.apply(this, args);
    }
}

// Test case
let j = 0;
function increment() {
  j++;
}
const throttledIncrement = throttle(increment, 100);
// t = 0: Call throttledIncrement(). j is now 1.
throttledIncrement(); // j = 1
// t = 50: Call throttledIncrement() again.
//  j is still 1 because 100ms have not passed.
throttledIncrement(); // j = 1
// t = 101: Call throttledIncrement() again. j is now 2.
// j can be incremented because it has been more than 100ms
//  since the last throttledIncrement() call at t = 0.
throttledIncrement(); //j = 2


// deeplone 简易版
function deepClone(value) {
    if (typeof value !== 'object' || value === null) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => deepClone(item));
    }

    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepClone(val)]));
}

// Test case
const obj1 = { user: { role: 'admin' } };
const clonedObj1 = deepClone(obj1);

clonedObj1.user.role = 'guest'; // Change the cloned user's role to 'guest'.
clonedObj1.user.role; // 'guest'
obj1.user.role; // Should still be 'admin'.

const obj2 = { foo: [{ bar: 'baz' }] };
const clonedObj2 = deepClone(obj2);

obj2.foo[0].bar = 'bax'; // Modify the original object.
obj2.foo[0].bar; // 'bax'
clonedObj2.foo[0].bar; // Should still be 'baz'.




//loadash._Get
function get(objectParam, pathParam, defaultValue) {
    const path = Array.isArray(pathParam) ? pathParam : pathParam.split('.');
    let len = path.length;
    let newObject = objectParam;
    let index = 0;

    while (index < len && newObject != null) {
        newObject = newObject[String(path[index])];
        index++;
    }
    // get（obj， ''）get(obj, 'a.b..c') 输出 defaultValue
    const value = index && index === len ? newObject : undefined;
    return value === undefined ? defaultValue : value;
}

// Test case
const john = {
    profile: {
      name: { firstName: 'John', lastName: 'Doe' },
      age: 20,
      gender: 'Male',
    },
};

const jane = {
    profile: {
      age: 19,
      gender: 'Female',
    },
};

get(john, 'profile.name.firstName'); // 'John'
get(john, 'profile.gender'); // 'Male'
get(jane, 'profile.name.firstName'); // undefined
get({ a: [{ b: { c: 3 } }] }, 'a.0.b.c'); // 3

// Event Emitter
class EventEmitter {
    constructor() {
        this._events = Object.create(null);
    }

    on(eventName, listener) {
        if (!Object.hasOwn(this._events, eventName)) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(listener);
        return this;
    }

    off(eventName, listener) {
        if (!Object.hasOwn(this._events, eventName)) {
            return;
        }
        const listeners = this._events[eventName];
        const index = listeners.findIndex((listenerItem) => listenerItem === listener);
        if (index < 0) {
            return;
        }
        this._events[eventName].splice(index, 1);
        return this;
    }

    emit(eventName, ...args) {
        if (!Object.hasOwn(this._events, eventName) || this._events[eventName].length === 0) {
            return false;
        }
        const listeners = this._events[eventName].slice();
        listeners.forEach(listener => {
            listener.apply(null, args);
        })
        return true;
    }
}

// Test case
const emitter = new EventEmitter();

function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}
emitter.on('foo', addTwoNumbers);
emitter.emit('foo', 2, 5);
// > "The sum is 7"

emitter.on('foo', (a, b) => console.log(`The product is ${a * b}`));
emitter.emit('foo', 4, 5);
// > "The sum is 9"
// > "The product is 20"

emitter.off('foo', addTwoNumbers);
emitter.emit('foo', -3, 9);
// > "The product is -27"




//html 序列化 ?
function serializeHTML(element, indent = '\t') {
    function traverse(element, depth) {
        if (typeof element === 'string') {
            return `${indent.repeat(depth)}${element}`;
        }
        const content = [];
        element.children.map((item) => {
            const child = traverse(item, depth + 1);
            content.push(child);
        });
        return [
            `${indent.repeat(depth)}<${element.tag.toLowerCase()}>`,
            ...content,
            `${indent.repeat(depth)}</${element.tag.toLowerCase()}>`
        ].join('\n'); //不要忘记转换成字符串
    }
    return traverse(element, 0);
}
// Test case
const tree = {
    tag: 'body',
    children: [
      { tag: 'div', children: [{ tag: 'span', children: ['foo', 'bar'] }] },
      { tag: 'div', children: ['baz'] },
    ],
  };
  
  serializeHTML(tree);
  // Output:
  `<body>
    <div>
      <span>
        foo
        bar
      </span>
    </div>
    <div>
      baz
    </div>
  </body>`;
  

// Event Emitter2 
class EventEmitter {
    constructor() {
        this._events = Object.create(null);
        this._key = 0;
    }

    on(eventName, listener) {
        if (!Object.hasOwn(this._events, eventName)) {
            this._events[eventName] = {};
        }
        const listenerId = this._key;
        this._events[eventName][listenerId] = listener;
        this._key++;
        return {
            off: () => {
                delete this._events[eventName][listenerId];
            }
        };
    }
    
      /**
       * @param {string} eventName
       * @param {...any} args
       * @returns boolean
       */
    emit(eventName, ...args) {
        if (!Object.hasOwn(this._events, eventName) || Object.keys(this._events[eventName]).length === 0) {
            return false;
        }
        const listeners = { ...this._events[eventName] };
        Object.values(listeners).forEach((listener) => {
            listener.apply(null, args);
        })
        return true;
    }

}

// Test case:
const emitter1 = new EventEmitter();

function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}

// Returns a subscription object that has an .off() method.
const sub = emitter1.on('foo', addTwoNumbers);
emitter1.emit('foo', 2, 5);
// > "The sum is 7"

emitter1.on('foo', (a, b) => {
  console.log(`The product is ${a * b}`);
});
emitter1.emit('foo', 4, 5);
// > "The sum is 9"
// > "The product is 20"

sub.off(); // This unsubscribes the callback that logs the sum of the numbers.
emitter1.emit('foo', -3, 9);
// > "The product is -27"
// (Only the multiply callback is triggered, the first one was unsubscribed.)





// Data selection 
function setHasOverlap(setA, setB) {
    // Bundler doesn't transpile properly when doing for-of for sets.
    for (const val of Array.from(setA)) {
      if (setB.has(val)) {
        return true;
      }
    }
  
    return false;
} 
  /**
   * @param {Array<{user: number, duration: number, equipment: Array<string>}>} sessions
   * @param {{user?: number, minDuration?: number, equipment?: Array<string>, merge?: boolean}} [options]
   * @return {Array}
   */
function selectData(sessions, options = {}) {
    const reversedSessions = sessions.slice().reverse(); // Make a copy and reverse.
    const sessionsForUser = new Map();
    const sessionsProcessed = [];
  

    // prepare the merge and set user map
    reversedSessions.forEach((session) => {
      if (options.merge && sessionsForUser.has(session.user)) {
        // 获取map user
        const userSession = sessionsForUser.get(session.user);
        // 累加duration
        userSession.duration += session.duration;
        // add 当前equipment
        session.equipment.forEach((equipment) => {
          userSession.equipment.add(equipment);
        });
      } else {
        // 把equipment放在set中
        const clonedSession = {
          ...session,
          equipment: new Set(session.equipment),
        };
        // 如果有merge需求 需要建立map
        if (options.merge) {
          sessionsForUser.set(session.user, clonedSession);
        }
  
        sessionsProcessed.push(clonedSession);
      }
    });
  
    sessionsProcessed.reverse();
  
    const results = [];
    // equipment建立set 查找表格
    const optionEquipments = new Set(options.equipment);
    sessionsProcessed.forEach((session) => {
      if (
        (options.user != null && options.user !== session.user) ||
        (optionEquipments.size > 0 && !setHasOverlap(optionEquipments, session.equipment)) ||
        (options.minDuration != null && options.minDuration > session.duration)
      ) {
        return;
      }
  
      results.push({
        ...session,
        //把set转换回来
        equipment: Array.from(session.equipment).sort(),
      });
    });
  
    return results;
}

  // Test case
[
    { user: 8, duration: 50, equipment: ['bench'] },
    { user: 7, duration: 150, equipment: ['dumbbell', 'kettlebell'] },
    { user: 1, duration: 10, equipment: ['barbell'] },
    { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
    { user: 7, duration: 200, equipment: ['bike'] },
    { user: 2, duration: 200, equipment: ['treadmill'] },
    { user: 2, duration: 200, equipment: ['bike'] },
];
selectData(sessions);
// [
//   { user: 8, duration: 50, equipment: ['bench'] },
//   { user: 7, duration: 150, equipment: ['dumbbell', 'kettlebell'] },
//   { user: 1, duration: 10, equipment: ['barbell'] },
//   { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
//   { user: 7, duration: 200, equipment: ['bike'] },
//   { user: 2, duration: 200, equipment: ['treadmill'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { user: 2 });
// [
//   { user: 2, duration: 200, equipment: ['treadmill'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { minDuration: 200 });
// [
//   { user: 7, duration: 200, equipment: ['bike'] },
//   { user: 2, duration: 200, equipment: ['treadmill'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { minDuration: 400 });
// [];

selectData(sessions, { equipment: ['bike', 'dumbbell'] });
// [
//   { user: 7, duration: 150, equipment: ['dumbbell', 'kettlebell'] },
//   { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
//   { user: 7, duration: 200, equipment: ['bike'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { merge: true });
// [
//   { user: 8, duration: 50, equipment: ['bench'] },
//   { user: 1, duration: 10, equipment: ['barbell'] },
//   { user: 7, duration: 450, equipment: ['bike', 'dumbbell', 'kettlebell'] },
//   { user: 2, duration: 400, equipment: ['bike', 'treadmill'] },
// ];

selectData(sessions, { merge: true, minDuration: 400 });
// [
//   { user: 7, duration: 450, equipment: ['bike', 'dumbbell', 'kettlebell'] },
//   { user: 2, duration: 400, equipment: ['bike', 'treadmill'] },
// ];

// deepClone
/**
 * @template T
 * @param {T} value
 * @return {T}
 */

function isPrimitiveTypeOrFunction(value) {
  return typeof value !== 'object' || typeof value === 'function' || value === null;
}

function getType(value) {
  const type = typeof value;
  if (type !== 'object') {
    return type;
  }
  return Object.prototype.toString.call(value).replace(/^\[object (\S+)\]$/, '$1').toLowerCase();
}

function deepCloneWithCache(value, cache) {
  if (isPrimitiveTypeOrFunction(value)) {
    return value;
  }

  const type = getType(value);
  if (type === 'set') {
    const cloned = new Set();
    value.forEach((item) => {
      cloned.add(deepCloneWithCache(item, cache));
    });
    return cloned;
  }

  if (type === 'map') {
    const cloned = new Map();
    value.forEach((value_, key) => {
      cloned.set(key, deepCloneWithCache(value_, cache));
    });
    return cloned;
  }

  if (type === 'function') {
    return value;
  }

  if (type === 'array') {
    return value.map((item) => deepCloneWithCache(item));
  }

  if (type === 'date') {
    return new Date(value);
  }

  if (type === 'regexp') {
    return new RegExp(value);
  }

  if (cache.has(value)) {
    return cache.get(value);
  }

  const cloned = Object.create(Object.getPrototypeOf(value));

  cache.set(value, cloned);
  for (const key of Reflect.ownKeys(value)) {
    const item = value[key];
    cloned[key] = isPrimitiveTypeOrFunction(item) ? item :deepCloneWithCache(item, cache);
  }
  return cloned;
}

function deepClone(value) {
  return deepCloneWithCache(value, new Map());
}

// Test case:
const obj11 = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: 'foo', id: 1 },
  arr: [0, 1, 2],
  date: new Date(),
  reg: new RegExp('/bar/ig'),
  [Symbol('s')]: 'baz',
};

const clonedObj1 = deepClone(obj11);
clonedObj1.arr.push(3);
obj1.arr; // Should still be [0, 1, 2]

const obj2 = { a: {} };
obj2.a.b = obj2; // Circular reference

const clonedObj12 = deepClone(obj12); // Should not cause a stack overflow by recursing into an infinite loop.

clonedObj2.a.b = 'something new';

obj2.a.b === obj2; // This should still be true

  
  
// apply
function myApply(ctx, args) {
    ctx = ctx === null|| ctx === undefined ? globalThis : Object(ctx);
    const key = new Symbol()
    Object.defineProperty(ctx, key, {
        value: this,
        enumerable: false
    });
    const r = ctx[key](...args);
    delete ctx[key];
    return r;
}

// call
function myCall(ctx, ...args) {
    ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx);
    const key = new Symbol();
    // Symbol 是 JavaScript 中的唯一值，用于确保临时属性名不会冲突。
    Object.defineProperty(ctx, key, {
        value: this, // 这里的 this 是调用apply前面的函数
        enumerable: false
    });
    // 将函数挂载到上下文对象
    const r = ctx[key](...args);
    // 清理临时属性
    delete ctx[key];
    return r;
}

// Test case:
function method(a, b) {
    console.log('arg:', a, b);
    console.log('this:', this);
}
method.myCall(1, 2, 3)


//bind !
Function.prototype.myBind = function (ctx, ...args) {
    const fn = this;
    return function(...subArgs) {
        const allArgs = [...args, ...subArgs];
        if (new.target) {
            return new fn(...allArgs)
        } else {
            return fn.apply(ctx, allArgs);
        } 
    }
}

//Test case:
function fn(a, b, c, d) {
    console.log('fn called');
    console.log('args:', a, b, c, d);
    console.log('this', this);
    return 123;
}
const newFn = fn.myBind('ctx', 1, 2)
console.log(newFn(3, 4));
// console.log(new newFn(3, 4));

  

//map 
function myMap(callBackFn, thisArg) {
    const len = this.len;
    const array = new Array(length);
     // 检查空位
    for (let k = 0; k < len; k++) {
        if (Object.hasOwn(this, k)) {
            // map也可以传入两个参数 一个是callBack 一个是callbak里this的指向
            // callBack可以接受三个参数： 当前值， index 和 整个数组
            array[k] = callBackFn.call(thisArg, this[k], k, this);
        }
    }
    return array;
}


// reduce
function myReduce(callBackFn, initialValue) {
    const noInitialValue = initialValue === undefined;
    const len = this.length;
    if (noInitialValue && len === 0) {
        throw new Error("Reduce of empty array with no initial value");
    }
    let acc = noInitialValue ? this[0] : initialValue;
    let startIndex = noInitialValue ? 1 : 0;
    for (let k = startIndex; k < len; k++) {
        if (Object.hasOwn(this, k)) {
            // reduce the call 可传入的参数为： 累计， 当前值， index和整个数组
            acc = callBackFn(acc, this[k], k, this);
        }
    }
    return acc;
}


function sanitizeVersion(version) {
  let sanitized = "";
  for (let char of version) {
      if ((char >= '0' && char <= '9') || char === '.') {
          sanitized += char;
      }
  }
  return sanitized;
}

function compareVersions(a, b) {
  const sanitizeA = sanitizeVersion(a);
  const sanitizeB = sanitizeVersion(b);

  const partsA = sanitizeA.split('.').map(Number);
  const partsB = sanitizeB.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const numA = partsA[i] || 0;
      const numB = partsB[i] || 0;

      if (numA > numB) return 1;
      if (numA < numB) return -1;
  }

  return 0;
}

const versions = ["1.21.0", "1.2.1", "1.2.0", "1.1.1", "1.1.0", "1.0.1", "1.0.0", "1.invalid.0"];
const sortedVersions = versions.sort(compareVersions);

console.log(sortedVersions);
// Output: ["1.0.0", "1.0.1", "1.1.0", "1.1.1", "1.2.0", "1.2.1", "1.21.0", "1.0.0"]


// 管道函数
function pipe(initial, ...funcs) {
  return funcs.reduce((acc, fn) => fn(acc), initial);
} 
const add2 = (x) => x+2
const mul2 = (x) => x*2
pipe(x, [add2, mul2]) // (x+2) * 2

function asyncPipe(initial, ...funcs) {
  return funcs.reduce((acc, fn) => {
    return acc.then(fn);
  }, Promise.resolve(initial));
}
const addOne = async (num) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(num + 1), 100);
  });
};

const multiplyByTwo = async (num) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(num * 2), 100);
  });
};

const subtractThree = async (num) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(num - 3), 100);
  });
};
const result = await asyncPipe(5, addOne, multiplyByTwo, subtractThree);
console.log(result); 


// square:
function mySqure() {
    const len = this.length;
    const result = new Array(len);

    for (let i = 0; i < len; i++) {
        result[i] = this[i] * this[i]
    }
    return result;
}


// flattenArray
function flattenArray(array, level = 1) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (Array.isArray(item) && level > 0) {
      // Recursively flatten if the item is an array and we still have levels to flatten
      result = result.concat(flattenArray(item, level - 1));
    } else {
      // Add the item to the result
      result.push(item);
    }
  }
  return result;
}

// Example usage:
const nestedArray = [1, [2, [3, [4, 5]]], 6];
console.log(flattenArray(nestedArray, 1)); // [1, 2, [3, [4, 5]], 6]
console.log(flattenArray(nestedArray, 2)); // [1, 2, 3, [4, 5], 6]
console.log(flattenArray(nestedArray, 3)); // [1, 2, 3, 4, 5, 6]
console.log(flattenArray(nestedArray, 0)); // [1, [2, [3, [4, 5]]], 6]



// Promise.all
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
      if (iterable.length === 0) {
          resolve([]);
          return; //!
      }
      let unresolve = iterable.length;
      const result = Array(iterable.length);
      iterable.forEach((item, index) => {
        Promise.resolve(item).then((data) => {
          result[index] = data;
          unresolve--;
          if (unresolve === 0) {
              resolve(result);
          }
        }).catch((err) => {
          reject(err);
        })  
      })
  });
}

// Test case
// Resolved example.
const p0 = Promise.resolve(3);
const p1 = 42;
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 100);
});
await promiseAll([p0, p1, p2]); // [3, 42, 'foo']

// Rejection example.
const p3 = Promise.resolve(30);
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('An error occurred!');
  }, 100);
});
try {
  await promiseAll([p3, p4]);
} catch (err) {
  console.log(err); // 'An error occurred!'
}


// 并发任务控制
function paralleTask(tasks, parallelCount) {
  return new Promise(resolve => {
    if (tasks.length === 0) {
      resolve();
      return;
    }
    let nextIndex = 0;
    let finishCount = 0;
    // const result = Array(tasks.length);
    // 如果需要返回一个result数组的话 const result = [];
    function _request() {
      const task = tasks[nextIndex];
      // const i = nextIndex;
      nextIndex++;
      task().then(() => {
        //result[i] = data....
        finishCount++;
        if (nextIndex < tasks.length) {
          _request();
        } else if (finishCount === tasks.length) {
          resolve();
          //resolve(result);
        }
      })
    }
    for (let i = 0; i < Math.min(tasks.length, parallelCount); i++) {
      _request();
    }
  });
}

// 场景题
function wrapBoth() {
    let activeCount = 0;
    let finishedCount = 0;
    
    // 用于开始执行时调用
    function startTracking() {
        if (activeCount === 0) {
            bothStart();
        }
        activeCount++;
    }

    // 用于结束时调用
    function endTracking() {
        finishedCount++;
        if (finishedCount === activeCount) {
            bothEnd();
        }
    }

    function bothStart() {
        console.log('Both started!');
    }
    
    function bothEnd() {
        console.log('Both ended!');
    }

    // 包装 playMusic 和 playAnimation
    return function() {
        playMusic(startTracking, () => {
            console.log('Music finished');
            endTracking();
        });
        playAnimation(startTracking, () => {
            console.log('Animation finished');
            endTracking();
        });
    };
}

// 示例函数实现
function playMusic(startCallback, endCallback) {
    startCallback();
    console.log('Music started');
    setTimeout(endCallback, 1000); // 模拟异步操作
}

function playAnimation(startCallback, endCallback) {
    startCallback();
    console.log('Animation started');
    setTimeout(endCallback, 2000); // 模拟异步操作
}

// 使用示例
const startBoth = wrapBoth();
startBoth();

// 依次顺序执行一系列任务 所有任务全部完成后可以得到每个任务的执行结果
// 需要要返回两个方法, start用于启动任务, pause用于暂停任务
// 每个任务具有原子性, 即不可中断, 只能在两个任务之间中断

function processTasks(...tasks) {
  let isRunning = false;
  const result = [];
  let i = 0;
  return {
    start() {
      return new Promise(async (resolve) => {
        if (isRunning) {
          return;
        }
        isRunning = true;
        while (i < tasks.length) {
          const task = tasks[i];
          const r = await task();
          result.push(r);
          i++;
          if (!isRunning) {
            return;
          }
        }
        isRunning = false;
        resolve(result);
      });
    },
    pause() {
      isRunning = false;
    }
  }
};

// 定义异步任务
const task1 = () => new Promise((resolve) => {
  setTimeout(() => {
    console.log("Task 1 completed");
    resolve("Result 1");
  }, 1000);
});

const task2 = () => new Promise((resolve) => {
  setTimeout(() => {
    console.log("Task 2 completed");
    resolve("Result 2");
  }, 1000);
});

const task3 = () => new Promise((resolve) => {
  setTimeout(() => {
    console.log("Task 3 completed");
    resolve("Result 3");
  }, 1000);
});

// 创建任务控制器
const controller = processTasks(task1, task2, task3);

(async function test() {
  console.log("Starting tasks...");

  // 启动任务并暂停
  controller.start().then((result) => console.log("Final result:", result));

  setTimeout(() => {
    console.log("Pausing tasks...");
    controller.pause();

    setTimeout(() => {
      console.log("Resuming tasks...");
      controller.start();
    }, 2000); // 2 秒后重新开始

  }, 1500); // 1.5 秒后暂停
})();

//  并行限制的Promise调度器
// class Scheduler {
//   constructor(maxCount = 2) {
//     this.queue = [];
//     this.maxCount = maxCount;
//     this.runCounts = 0;
//   }

//   add(promiseCreator) {
//     this.queue.push(promiseCreator);
//   }

//   taskStart() {
//     for (let i = 0; i  < this.maxCount; i++) {
//       this.request();
//     }
//   }

//   request() {
//     if (!this.queue || this.queue.length === 0 || this.runCounts >= this.maxCount) {
//       return;
//     }
//     this.runCounts++;
//     const task = this.queue.shift();
//     task.then(() => {
//       this.runCounts--;
//       this.request();
//     });
//   }

// }
class Scheduler {
  constructor(maxCount) {
    this.maxCount = maxCount;
    this.queue = [];
    this.runningCount = 0;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject
      });
      this.request();
    })
  }

  request() {
    while (this.runningCount < this.maxCount || this.queue.length !== 0) {
      this.runningCount++;
      const { task, resolve, reject } = this.queue.shift();
      Promise.resolve(task()).then(resolve, reject).finally(() => {
        this.runningCount--;
        this.request();
      })
    }
  }
}

// Promise Cache

const promiseCache = new Map();

function fetchData(url) {
  if (promiseCache.has(url)) {
    return promiseCache.get(url);
  }
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Fetching data from ${url}`);
      resolve(`Data from ${url}`);
    }, 1000);
  });
  promiseCache.set(url, promise);
  return promise;
}

fetchData('https://api.example.com/data1')
  .then(data => console.log(data))
  .catch(error => console.error(error));

fetchData('https://api.example.com/data1')
  .then(data => console.log(data))
  .catch(error => console.error(error));


// fetchWithRetry
function fetchWithRetry(url, options, maxRetry = 3) {
  return new Promise((resolve, reject) => {
    const doFetch = async (attempt) => {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          resolve(response);
        }
      } catch (error) {
        if (attempt < maxRetry) {
          doFetch(attempt + 1);
        } else {
          reject('Max retires reached..');
        }
      }
    };
    doFetch(0);
  })
}
function fetchWithRetry(url, options, maxRetry = 3) {
  return new Promise((resolve, reject) => {
    const doFetch = (attempt) => {
      Promise.resolve()
        .then(() => fetch(url, options))
        .then((response) => {
          if (response.ok) {
            resolve(response); // 如果响应成功且状态为 200~299，则解析并返回
          } else {
            throw new Error('Non-OK response'); // 如果状态不是 OK，抛出错误
          }
        })
        .catch((error) => {
          if (attempt < maxRetry) {
            doFetch(attempt + 1); // 重试逻辑
          } else {
            reject(`Max retries reached: ${error.message}`); // 达到最大重试次数
          }
        });
    };
    doFetch(0); // 初次调用
  });
}
fetchWithRetry("https://jsonplaceholder.typicode.com/posts/1", {}, 3)
  .then((response) => response.json())
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Failed:", error));

fetchWithRetry("https://invalid-url", {}, 2)
  .then((response) => console.log("Success:", response))
  .catch((error) => console.error("Failed:", error)); // 输出：Max retries reached...

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
          })
      })
  })
}
  
async function mergePromise(promises) {
  const data = [];
  for (let i = 0; i < promises.length; i++) {
    const result = await promises[i](); // 按顺序执行
    data.push(result); // 存储结果
  }
  return data;
}

// promise红绿灯

function red() {
  console.log('Red');
}

function green() {
  console.log('Green');
}

function yellow() {
  console.log('Yellow');
}

const light = function(timer, cb) {
  return new Promise((resolve) => {
    cb();
    setTimeout(() => {
      resolve();
    }, timer);
  })
};

const step = function () {
  Promise.resolve().then(() => {
    return light(3000, red);
  }).then(() => {
    return light(2000, green);
  }).then(() => {
    return light(2000, yellow);
  })
}
step();


function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastExecuted.current >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    }
  }, [value, delay]);

  return throttledValue;
}

const throttledScroll = useThrottle(scrollPosition, 200);
useEffect(() => {
  console.log("Throttled Scroll Position:", throttledScroll);
}, [throttledScroll]);

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const [theme, setTheme] = useLocalStorage("theme", "light");

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

useInterval(() => {
  console.log("Polling data...");
}, 1000);

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

function useTimeout(callback, delay) {
  const memorizeCallback = useRef();

  useEffect(() => {
    memorizeCallback.current = callback;
  }, [callback]);
  // memorizeCallback.current 的初始值会是 callback，但之后不会随着 callback 的更新而改变，除非手动更新它。
  useEffect(() => {
    if (delay !== null) {
      const timer = setTimeout(() => {
        memorizeCallback.current();
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [delay]);
};
  // callback 回调函数， delay 延迟时间
useTimeout(callback, delay);


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // Cleanup function to clear the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect if value or delay changes

  return debouncedValue;
}

import useDebounce from "./useDebounce";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500); // Debounce the query with a delay of 500ms

  useEffect(() => {
    if (debouncedQuery) {
      // Perform API call or expensive operation with debouncedQuery
      console.log("Performing search for:", debouncedQuery);
    }
  }, [debouncedQuery]); // Trigger effect when debounced value changes

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}


function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value; // Update ref to the current value on every render
  }, [value]); // Trigger effect whenever the value changes

  return ref.current; // Return the previous value (before the most recent render)
}
// 因为useEffect是在组件渲染后执行 所以每次return老的值 再更新的值 


function useParamFetch (url, param, retryTimes = 3) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const buildUrlWithParams = () => {
    const query = new URLSearchParams(param).toString();
    return `${url}?${query}`;
  };

  useEffect(() => {
    const fetchData = (attemptsLeft) => {
      setLoading(true);
      setError(null);

      fetch(buildUrlWithParams())
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          setData(result);
          setLoading(false);
        })
        .catch((err) => {
          if (attemptsLeft > 0) {
            fetchData(attemptsLeft - 1);
          } else {
            setError(err);
            setLoading(false);
          }
        });
    };

    fetchData(retryTimes);
  }, [url, param, retryTimes]);

  return { data, error, loading };
};