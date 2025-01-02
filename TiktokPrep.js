// debounce
function debounce(func, wait = 0) {
    let timeoutId = null;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
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
            throttling = false;
        }, wait);
        func.apply(this, args);
    }
}

// Test case
let i = 0;
function increment() {
  i++;
}
const throttledIncrement = throttle(increment, 100);

// t = 0: Call throttledIncrement(). i is now 1.
throttledIncrement(); // i = 1

// t = 50: Call throttledIncrement() again.
//  i is still 1 because 100ms have not passed.
throttledIncrement(); // i = 1

// t = 101: Call throttledIncrement() again. i is now 2.
//  i can be incremented because it has been more than 100ms
//  since the last throttledIncrement() call at t = 0.
throttledIncrement(); // i = 2




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
const p0 = Promise.resolve(30);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('An error occurred!');
  }, 100);
});

try {
  await promiseAll([p0, p1]);
} catch (err) {
  console.log(err); // 'An error occurred!'
}




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
        ].join('\n');
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
const emitter = new EventEmitter();

function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}

// Returns a subscription object that has an .off() method.
const sub = emitter.on('foo', addTwoNumbers);
emitter.emit('foo', 2, 5);
// > "The sum is 7"

emitter.on('foo', (a, b) => {
  console.log(`The product is ${a * b}`);
});
emitter.emit('foo', 4, 5);
// > "The sum is 9"
// > "The product is 20"

sub.off(); // This unsubscribes the callback that logs the sum of the numbers.
emitter.emit('foo', -3, 9);
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
export default function selectData(sessions, options = {}) {
    const reversedSessions = sessions.slice().reverse(); // Make a copy and reverse.
    const sessionsForUser = new Map();
    const sessionsProcessed = [];
  

    // prepare the merge and set user map
    reversedSessions.forEach((session) => {
      if (options.merge && sessionsForUser.has(session.user)) {
        const userSession = sessionsForUser.get(session.user);
        userSession.duration += session.duration;
        session.equipment.forEach((equipment) => {
          userSession.equipment.add(equipment);
        });
      } else {
        const clonedSession = {
          ...session,
          equipment: new Set(session.equipment),
        };
  
        if (options.merge) {
          sessionsForUser.set(session.user, clonedSession);
        }
  
        sessionsProcessed.push(clonedSession);
      }
    });
  
    sessionsProcessed.reverse();
  
    const results = [];
    const optionEquipments = new Set(options.equipment);
    sessionsProcessed.forEach((session) => {
      if (
        (options.user != null && options.user !== session.user) ||
        (optionEquipments.size > 0 &&
          !setHasOverlap(optionEquipments, session.equipment)) ||
        (options.minDuration != null && options.minDuration > session.duration)
      ) {
        return;
      }
  
      results.push({
        ...session,
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

  
  
  // apply
function myApply(ctx, args) {
    ctx = ctx === null|| ctx === undefined ? globalThis : Object(ctx);
    const key = new Symbol()
    Object.defineProperties(ctx, key, {
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
    Object.defineProperties(ctx, key, {
        value: this,
        enumerable: false
    });
    const r = ctx[key](...args);
    delete ctx[key];
    return r;
}

// Test case:
function method(a, b) {
    console.log('arg:', a, b);
    console.log('this:', this);
}
method.myCall(1, 2, 3)


//bind
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
    for (let k = 0; k < len; k++) {
        if (Object.hasOwn(this, k)) {
            //map也可以传入两个参数 一个是callBack 一个是callbak里this的指向
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


// square:
function mySqure() {
    const len = this.length;
    const result = new Array(len);

    for (let i = 0; i < len; i++) {
        result[i] = this[i] * this[i]
    }
    return result;
}

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
  
  export default function deepClone(value) {
    return deepCloneWithCache(value, new Map());
}

// Test case:
const obj1 = {
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
  
  const clonedObj1 = deepClone(obj1);
  clonedObj1.arr.push(3);
  obj1.arr; // Should still be [0, 1, 2]
  
  const obj2 = { a: {} };
  obj2.a.b = obj2; // Circular reference
  
  const clonedObj2 = deepClone(obj2); // Should not cause a stack overflow by recursing into an infinite loop.
  
  clonedObj2.a.b = 'something new';
  
  obj2.a.b === obj2; // This should still be true
  

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

  


 