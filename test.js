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
function deepClone(value) {
    if (typeof value !== 'object' || value === null) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => deepClone(item));
    }

    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepClone(val)]));
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

// event Emitter2 
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

// data selection 

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
  
  // apply

  // call
  

  


 