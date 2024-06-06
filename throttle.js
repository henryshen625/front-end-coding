function throttle1(fn, delay) {
    let timer = null;
    return function(...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        }
    }
}

/**
 * 
 * @param {要进行节流的函数} func 
 * @param {间隔时间} wait 
 * @returns 
 */
 function throttle2(func, wait) {
    var args; // 存储函数参数
    var previous = 0; // 一开始的默认时间
    return function () {
        var now = new Date(); // 获取最新的时间戳
        args = arguments; // 获取参数
        // 进行时间戳的判断，如果超出规定时间，则执行
        console.log(now - previous);
        if (now - previous > wait) {
            func.apply(null, args);
            previous = now;
        }
    }
}

const throttleTimestampFn = throttle2((msg) => {
    console.log(msg);
}, 1000);

throttleTimestampFn("Hello"); // 立即输出 "Hello"
setTimeout(() => throttleTimestampFn("World"), 500); // 被忽略
setTimeout(() => throttleTimestampFn("Again"), 1500); // 1.5秒后输出 "Again"