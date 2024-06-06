/**
 * 函数防抖
 * @param {function} func 一段时间后，要调用的函数
 * @param {number} wait 等待的时间，单位毫秒
 */
 function debounce(func, wait) {
    // 设置变量，记录 setTimeout 得到的 id
    let timerId = null;
    return function (...args) {
        if (timerId) {
            // 如果有值，说明目前正在等待中，清除它
            clearTimeout(timerId);
        }
        // 重新开始计时
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    }
}