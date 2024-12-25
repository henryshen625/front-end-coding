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