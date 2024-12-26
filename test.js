// function red() {
//     console.log('red');
// }
// function green() {
//     console.log('green');
// }
// function yellow() {
//     console.log('yellow');
// }
// const task = (timer, light) => 
//     new Promise((resolve, reject) => {
//         setTimeout(() => {
//             if (light === 'red') {
//                 red()
//             }
//             else if (light === 'green') {
//                 green()
//             }
//             else if (light === 'yellow') {
//                 yellow()
//             }
//             resolve()
//         }, timer)
//     })
// const step = () => {
//     task(3000, 'red')
//         .then(() => task(2000, 'green'))
//         .then(() => task(1000, 'yellow'))
//         .then(step)
// }
// step()

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
//立即执行
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

// deeplone 简易版
function sampleDeepClone(value) {
    if (typeof value !== 'object' || value === null) {
        return null;
    }
    if (Array.isArray(value)) {
        return value.map(item => sampleDeepClone(item));
    }
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, sampleDeepClone(value)]));
}

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
    // get（obj， ''）输出 defaultValue
    const value = index && index === len ? newObject : undefined;
    return value === undefined ? defaultValue : value;
}

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

// event Emitter ?

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


