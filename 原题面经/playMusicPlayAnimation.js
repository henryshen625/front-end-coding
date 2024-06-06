function wrapBoth(bothStart, bothEnd) {
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

    // 包装 playMusic 和 playAnimation
    return function() {
        startTracking();
        playMusic(() => {
            console.log('Music finished');
            endTracking();
        });

        startTracking();
        playAnimation(() => {
            console.log('Animation finished');
            endTracking();
        });
    };
}

// 示例函数实现
function playMusic(callback) {
    console.log('Music started');
    setTimeout(callback, 1000); // 模拟异步操作
}

function playAnimation(callback) {
    console.log('Animation started');
    setTimeout(callback, 2000); // 模拟异步操作
}

function bothStart() {
    console.log('Both started!');
}

function bothEnd() {
    console.log('Both ended!');
}

// 使用示例
const startBoth = wrapBoth(bothStart, bothEnd);
startBoth();