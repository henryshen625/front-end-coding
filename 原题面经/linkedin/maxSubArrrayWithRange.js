function maxSubArrayWithRange(nums) {
    if (nums.length === 0) {
        return { maxSum: 0, start: -1, end: -1 };
    }


    let maxSum = nums[0];
    let currentSum = nums[0];
    let start = 0;
    let end = 0;
    let tempStart = 0;

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > currentSum + nums[i]) {
            currentSum = nums[i];
            tempStart = i;
        } else {
            currentSum += nums[i];
        }

        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }
    }

    return { maxSum, start, end };
}

console.log(maxSubArrayWithRange([-2,1,-3,4,-1,2,1,-5,4]));
console.log(maxSubArrayWithRange([5,4,-1,7,8]));