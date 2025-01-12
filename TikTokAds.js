// 3043： Trie + Hashmap
// 看到common prefix应该先想到trie是否能解决问题
class Trie {
    constructor() {
        this.children = {};
    }

    insert(word) {
        let node = this;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new Trie();
            }
            node = node.children[char];
        }
    }

    findLongestPrefix(word) {
        let node = this;
        let counter = 0;
        for (const char of word) {
            if (!node.children[char]) {
                return counter;
            }
            counter++;
            node = node.children[char];
        }
        return counter
    }
}
function longestCommonPrefix(arr1, arr2) {
    const tree = new Trie();
    for (const char of arr1) {
        tree.insert(String(char));
    }
    let result = 0;
    for (const char of arr2) {
        result = Math.max(tree.findLongestPrefix(String(char)), result);
    }
    return result;
}
// TC： O((N+M)⋅L)  SC: O(N⋅L)

// leetcode 394 stack
// 字符串组合/运算 应该 想到用stack

// 用两个stack去保存[]之前的变量 每当[]结束 把现有的和之前栈里的再合并
function decodeString(s) {
    const numStack = [];
    const strStack = [];
    let result = '';
    let num = 0;
    for (const char of s) {
        //有可能数字是多位
        if (!isNaN(char)) {
            num = num * 10 + parseInt(char);
            // 如果碰到[说明要开始进行新的一轮的运算 那把之前的数据保存到栈中
        } else if (char === '[') {
            strStack.push(result);
            result = '';
            numStack.push(num);
            num = 0;
        } else if (char === ']') {
            const repeatTime = numStack.pop();
            const previousChar = strStack.pop();
            result = previousChar + result.repeat(repeatTime);
        } else {
            result += char;
        }
    }
    return result;
}

// TC：O(maxK^(countK)n), where maxK is the maximum value of k, countK is the count of nested k values and n is the maximum length of encoded string.  SC: O(M + N)


// leetcode 415 : string/ math
//destructure： Two pointer with Math: 双指针从右往左遍历，合并sum字符串且注意curry
function addStrings(num1, num2) {
    let p = num1.length - 1;
    let q = num2.length - 1;
    let result = '';
    let curry = 0;
    while (p >= 0 || q >= 0) {
        const p1 = p >= 0 ? parseInt(num1[p]) : 0;
        const p2 = q >= 0 ? parseInt(num2[q]) : 0;
        const sum = p1 + p2 + curry;
        result = String(sum % 10) + result;
        curry = Math.floor(sum / 10);
        p--;
        q--;
    }
    //两个指针都小于0 但最高位的和> 10， 所以需要check curry
    if (curry > 0) {
        result = '1' + result;
    }
    return result;
}

//TC:O(n)  SC: O(1);


// Leetcode: 694 graph dfs
// 典中典 岛屿问题->图
// destructure：用dfs来沉没便利过的岛屿 但是本题需要注意的是不一样岛屿形状
// 我们已知我们每次dfs的方向都是固定， 所以岛屿形状->dfs遍历路径
// 过滤不一样的路径：Set 利用path字符串记录每次dfs遍历方向 
// 特别注意： 我们也要把本次循环所有方向dfs结束后的回退记录在内， 因为有特殊情况导致了只记录udlr还是会产生不一样的路径
function numDistinctIslands(grid) {
    if (grid.length === 0) {
        return 0;
    }
    const m = grid.length;
    const n = grid[0].length;
    let path = '';
    const distinct = new Set();

    const dfs = (i, j, direction) => {
        if (i < 0 || i >= m || j < 0 || j >= n) {
            return;
        }
        if (grid[i][j] === 0) {
            return;
        }
        grid[i][j] = 0;
        path += direction;
        dfs(i, j + 1, 'r');
        dfs(i, j - 1, 'l');
        dfs(i - 1, j, 'd');
        dfs(i + 1, j, 'u');
        //记录回退
        path += 'b';
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                //也要记录下起始点；
                dfs(i, j, 'o');
                // js中的只能识别出不同的基本类型 所以要用字符串
                distinct.add(path);
                path = ''
            }
        }
    }
    return distinct.size;
}

// TC：O(m×n) SC: O(m×n)


// Leetcode 78 backtracking
// destructure：看到subset问题可以联想到组合问题 -> backtracking

function subsets(nums) {
    const result = [];
    const path = [];
    // 每次递归先push path到result中 1. 空数组也是subset 也可以自然而然的到result中 
    // 2.当index===length的时候其实是数组中最后一个数字 所以也要push进去 然后再退出backtracking
    const backtracking = (index) => {
        result.push([...path]);
        if (index === nums.length) {
            return;
        }
        for (let i = index; i < nums.length; i++) {
            path.push(nums[i]);
            backtracking(i + 1);
            path.pop();
        }
    }
    backtracking(0);
    return result;
}

// Leetcode 3: Slidng Winodow
// destructure: 看到一个字符串/数组寻找符合要求时候子数组或者字符串时 应该考虑

function lengthOfLongestSubstring(s) {
    const map = new Map();
    let result = 0;
    let left = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        map.set(char, (map.get(char) || 0) + 1);
        if (map.size === right - left + 1) {
            result = Math.max(result, result - left + 1);
        }
        while (right - left + 1 > map.size) {
            const leftChar = s[left];
            map.set(leftChar, map.get(leftChar) - 1);
            if (map.get(leftChar) === 0) {
                map.delete(leftChar);
            }
            left++;
        }
    }
    return result;
}
// 优化
function lengthOfLongestSubstring(s) {
    let map = new Map();
    let result = 0;
    for (let right = 0; right < s.length; right++) {
        if (map.has(s[right])) {
            // 防止回退 例如abba 如果没有max的话 left到a的时候会回到1
            left = Math.max(map.get(s[right]), left);
        }
        result = Math.max(result, right - left + 1);
        // 直接把left放到重复字符串的下一个位置开始计算
        map.set(s[right], right + 1);
    }
    return result;
}
// TC: O(n) SC: O(n)


// leetcode 134: greedy ->需要多看一下
// destructure: 三个变量 start：记录正确时开始位置 curr:从上一个start开始到当前位置油耗 total： 记录全局油量差
// 当 curr< 0 代表从当前start 到 i是不行的 start = i + 1 ->因为 previousI + i < 0  且 abs[i]不可能大于 previous[I] 所以i肯定也小于0
// 然后最后totoal会告诉我们给的input是不是可行的 如果大于0 可以 小于的话 从哪里的开始都不可能
function canCompleteCircuit(gas, cost) {
    let currSum = 0;
    let total = 0;
    let start = 0;
    for (let i = 0; i < gas.length; i++) {
        const diff = gas[i] - cost[i];
        currSum += diff;
        total += diff;
        if (currSum < 0) {
            start = i + 1;
            currSum = 0;
        }
    }
    if (total < 0) {
        return -1;
    }
    return start;
}

//https://www.bilibili.com/video/BV1jA411r7WX?spm_id_from=333.788.videopod.sections&vd_source=f0204c636c2689ae89f76e34182b5139

// Leetcode 200: 岛屿问题 dfs ->图 
// 背

function numIslands(grid) {
    if (grid.length === 0) {
        return 0;
    }
    const row = grid.length;
    const column = grid[0].length;
    let result = 0;

    const dfs = (i, j) => {
        if (i < 0 || i >= row || j < 0 || j >= column) {
            return;
        }
        // 注意input给的1 0格式是什么
        if (grid[i][j] === '0') {
            return;
        }
        grid[i][j] = '0';
        dfs(i, j + 1);
        dfs(i, j - 1);
        dfs(i - 1, j);
        dfs(i + 1, j);
    }
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            if (grid[i][j] === '1') {
                dfs(i, j);
                result++;
            }
        }
    }
    return result;
}
// leetcode 1071: 两个字符串的最大公因数
// 最土味的做法 就是枚举

function gcdOfStrings(str1, str2) {
    function check(sub, str) {
        const lenX = Math.floor(str / sub);
        return sub.repeat(lenX) === str;
    }
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = Math.min(len1, len2); i >= 1 ; i--) {
        if (len1 % i === 0 && len2 % i === 0) {
            const sub = str1.substring(0, i);
            if (check(sub, str1) && check(sub, str2)) {
                return sub;
            }
        }
    }
    return '';
}
// TC: O(n *(m + n)) SC: O(n)
// 数学公式：
var gcdOfStrings = function(str1, str2) {
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }

    const len1 = str1.length;
    const len2 = str2.length;
    const gcdLen = gcd(len1, len2); // 找到最大公约数长度

    const candidate = str1.substring(0, gcdLen); // 截取候选的 GCD 字符串
    if (str1 === candidate.repeat(len1 / gcdLen) && str2 === candidate.repeat(len2 / gcdLen)) {
        return candidate;
    }

    return '';
};

// Leetcode 648: String + Trie
// destructure: 词根->衍生词 ->前缀 可以联想到Trie 且每个词我们需要返回最短的词根
// 那么在trie中 我们每个词根结束的时候 需要进行标记 让每词搜索的时候检查是否为end 如果是就返回 不是则进行下一层搜索

class Trie {
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
    insert(word) {
        let node = this;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new Trie();
            }
            node = node.children[char];
        }
        node.isEnd = true;
        return;
    }

    search(word) {
        let temp = '';
        let node = this;
        for (const char of word) {
            if (!node.children[char]) {
                return;
            }
            temp += char;
            if (node.children[char].isEnd) {
                return temp;
            }
            node = node.children[char];
        }
        return;
    }
}
function replaceWords(dictionary, sentence) {
    const tree = new Trie();
    for (const word of dictionary) {
        tree.insert(word);
    }
    const sentenceList = sentence.split(' ');
    const result = [];
    for (const word of sentenceList) {
        const checkedWord = tree.search(word) || word;
        result.push(checkedWord);
    }
    return result.join(' ');
}

// Leetcode: 139 （不熟练） DFS + backtracking
// destructure: 看到这题 可能首先会想到string方面的操作 同时包含了prefix等提示词在内 我们可能会想到用trie 但是用trie的话 感觉要一个sub array一个sub array遍历
// 感觉时间复杂度不是特别匹配 如何能快速知道一段单词是否出现wordDic中？ HashSet?+ 回溯？
function wordBreak(s, wordDict) {
    const n = s.length;
    const wordSet = new Set(wordDict);
    const memo = Array(n);

    const canBreak = (start) => {
        // 说明这个s已经测过了 现在指针在n
        if (start === n) {
            return true;
        }
        // 认为一般是后半部的memo先填完 然后第一圈遍历到后面部分的时候就知道行不行了
        if (memo[start] !== undefined) {
            return memo[start];
        }
        for (let i = start + 1; i <= n; i++) {
            //因为slice是左闭又开 所以包含n才能包含最后一个字符
            const prefix = s.slice(start, i);
            // 如果说当前sub string在set中 且之后substring也能顺利包含的话 return true （剪枝）
            if (wordSet.has(prefix) && canBreak(i)) {
                return true;
                // 说明当前start的这个位置是能分割的
                memo[start] = true;
            }
        }
        memo[start] = false;
        return false;
    }
    return canBreak(0);
}


// leetcode 15: 3sum -> two pointer -> three pointer
// 必须会 ！ destructure： 大概思路就是找到三个数和为0的组合 那么外圈是i 两个指针是left = i + 1， right = nums.length - 1 慢慢向中间聚拢 找到答案
// 实现三指针重要的基础 就是sort 数组从小到大 才能正确的找答案

function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < nums.length; i++) {
        // 剪枝 因为i 都大于0了 比不可能组成== 0的组合了
        if (nums[i] > 0) {
            break;
        }
        // 剪枝 + 去重
        if (i > 0 && nums[i] === nums[i - 1]) {
            continue;
        }
        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum > 0) {
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                result.push([nums[i], nums[left], nums[right]]);
                //去重
                while (left < right && nums[right] === nums[right - 1]) {
                    right--;
                }
                // 去重
                while (left < right && nums[left] === nums[left + 1]) {
                    left++;
                }
                // 像中间聚拢 查找下一组合适的答案
                left++;
                right--;
            }
        }
    }
    return result;
}
// TC O(n^2) SC： O（n) 优化 2 set + map


// Leetcode 1011: Binary Search
// Destructure: 我们从题目中能得知 题目想我们从一段区间内寻找一个最小值capacity 能满足days ->在有序区间内寻找最小值 ->二分 有点像猩猩吃香蕉
// 本题需要注意的点： left 和 right 的取值要合理 left要取weight中最大值 因为要至少满足当天能够ship  right是sum(weights)
function shipWithinDays(weights, days) {
    const checkCapacity = capacity => {
        let totalDays = 1;
        let currWeight = 0;
        for (let i = 0; i < weights.length; i++) {
            if (currWeight + weights[i] > capacity) {
                currWeight = 0;
                totalDays += 1;
            }
            if (totalDays > days) {
                return false;
            }
            currWeight += weights[i];
        }
        return true;
    }
    let left = Math.max(...weights);
    let right = weights.reduce((acc, curr) => acc + curr, 0);

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        if (checkCapacity(mid)) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return left;
}
// TC: O(N*Log(Sum(Weights))) SC: O(1)

// Leetcode 1091: Graph + BFS
// Destructure: 查找0， 0 到 n - 1, n - 1的最短路径 包含障碍 且 可以把个方向 只需要添加进队列的条件 和多四个direction
function shortestPathBinaryMatrix(grid) {
    const n = grid.length - 1;
    // 如果起始点和终点任意一点为1 说明不可能到达
    if (grid[0][0] === 1 || grid[n][n] === 1) return -1;
    const direction = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [-1, -1], [1, -1]];
    const queue = [];
    const path = new Set();
    queue.push([0, 0, 1]);
    path.add('0,0');

    while (queue.length !== 0) {
        const [row, col, step] = queue.shift();
        if (row === n && col === n) {
            return step;
        }
        for (const [x, y] of direction) {
            const newX = x + row;
            const newY = y + col;
            if (newX >= 0 && newX <= n && newY >= 0 && newY <= n && grid[newX][newY] === 0) {
                if (!path.has(`${newX},${newY}`)) {
                    queue.push([newX, newY, step + 1]);
                    path.add(`${newX},${newY}`);
                }
            }
        }
    }
    return -1;
}
// TC: O(N) SC: O(N)


// Leetcode 1209
// Destructure: 可以连为对对碰 然后看到后面的元素可以消除前面的元素  就可以联想到stack 需要注意的一点 我们还需要一个辅助stack去帮我们记录前一个
// 不同字母的个数 这样我们才知道当我们消除一串数字之后 前一个数字连续的数量 
function removeDuplicates(s, k) {
    const stack = [];
    const counter = [];
    for (let i = 0; i < s.length; i++) {
        if (stack.length === 0 || stack[stack.length - 1] !== s[i]) {
            stack.push(i);
            counter.push(1);
        } else if (stack[stack.length - 1] === s[i]) {
            counter[counter.length - 1] += 1;
            stack.push(s[i]);
            if (counter[counter.length - 1 === k]) {
                let count = k;
                while (count > 0) {
                    stack.pop();
                    count--;
                }
                counter.pop();
            }
        }
    }
    return stack.join('');
}
// TC: O(n) SC: O(n)

// leetcode 695 Graph + dfs 
// Destructure: 最大岛屿 当碰见1时进行dfs 然后遍历四个方向传回的值，记得加当前岛屿面积为1
function maxAreaOfIsland(grid) {
    const m = grid.length;
    const n = grid[0].length;

    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n) {
            return 0;
        }
        if (grid[i][j] === 0) {
            return 0;
        }
        grid[i][j] = 0;
        return 1 + dfs(i, j + 1) + dfs(i, j - 1) + dfs(i - 1, j) + dfs(i + 1, j);
    }
    let result = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                result = Math.max(result, dfs(i, j));
            }
        }
    }
    return result;
}
// TC: O(m * n) SC: O(m * n)

// Leetcode 2402: Heap + sort
// Destructure: 这道题我认为最优解应该是两个heap 一个管理空闲meeting room 一个管理使用中的meeting room
// 用堆的理由：如果空闲heap不为空 我可以每次从heap中pop出index最小的meeting room 如果heap不为空 那我们从使用中heap pop出最早结束的meeting room进行操作
// 但是碍于js没有原生heap 我们暂时使用每次循环 来查找空闲meeting room或者最早结束meeting room
function mostBooked(n, meetings) {
    const idle = Array(n).fill(-1);
    const counter = Array(n).fill(0);
    meetings.sort((a, b) => a[0] - b[0]);

    for (const meeting of meetings) {
        const [start, end] = meeting;
        let isAvaliable = false;
        // earliestRoom初始值不重要
        let earliestRoom = 0;
        let earliestEnd = Infinity;
        for (let i = 0; i < n; i++) {
            // 如果有空会议室的话： 直接使用 更新end 把flag设置成true
            // 注意 有空闲的话 选择最小的 所以从0开始向后遍历 有的话 直接break
            if (idle[i] <= start) {
                isAvaliable = true;
                idle[i] = end;
                counter[i] += 1;
                break;
            }
            // 如果没有空会议室 寻找最早结束的会议室
            if (idle[i] < earliestEnd) {
                earliestEnd = idle[i];
                earliestRoom = i;
            }
        }
        // 在没有空会议室的前提下： 更新当前会议室的end time->等于说再上一个会议的基础上 我直接把当前的会议时长（ end - start）合并进去
        if (!isAvaliable) {
            idle[earliestRoom] += end - start;
            counter[earliestRoom] += 1;
        }
    }
    return counter.indexOf(Math.max(...counter));
}

// leetcode 301: backtracking + bfs? + stack
// Destructure: 列出所有情况？-> backtracking  valid parentheses -> stack? 所以可以联想到我们之前word break的做法：
// 1. 通过stack找到这个string 中invalid括号的个数 2.从一个位置开始拿掉当前括号 是否还有invlaid的括号 进行backtracking

function removeInvalidParentheses(s) {
    const result = [];
    // 创建一个用来检测invalid括号数量函数
    function invalidParentheses(s) {
        //放左括号
        const stack = [];
        // 记录非法右括号
        let counter = 0;
        for (const bracket of s) {
            if (bracket === '(') {
                stack.push(bracket);
            } else if (bracket === ')') {
                if (stack.length !== 0) {
                    stack.pop();
                } else {
                    counter++;
                }
            }
        }
        return counter + stack.length;
    }
    //回溯
    function backtracking(s, index, k) {
        //如果当前s非法括号为0
        if (invalidParentheses(s) === 0) {
            result.push(s);
            return;
        }
        //如果k已经用完所有k了 且还是非法
        if (k === 0) {
            return;
        }
        for (let i = index; i < s.length; i++) {
            //去重
            if (i > index && s[i] === s[i - 1]) {
                continue;
            }
            // 跳过字母
            if (s[i] !== '(' && s[i] !== ')') {
                continue;
            }
            //拿掉当前字符
            const substring = s.slice(0, i) + s.slice(i + 1);
            // 进行下一轮回溯： 注意： 因为当前字符已经拿走了 所以i已经自动指到下一位了 所以只用-k即可
            backtracking(substring, i, k - 1);
        }
    }
    backtracking(s, 0, invalidParentheses(s));
    return result;
}
// TC: O(2^n) 2 to the nth power SC: O(n)


// leetcode 34: binary search
// TODO: 

//leetcode 735: stack + 方向性

// Destructure：当我们又看到类似对对碰 消消乐的题型 我们就可以联想到用stack 但是有几点需要注意：
// 1.正数往右 负数往左： 那么如果负数在stack中 当前数字是正数的话 是否进栈？ 2.如果判定一个行星是否进栈 3.何时应该从stack pop？
function asteroidCollision(asteroids) {
    const stack = [];
    for (const asteroid of asteroids) {
        let alive = true;
        // 什么时候开始进行撞击： 1. 当前行星alive 2.stack不为空 3.stack的最后一个元素是大于0 4.当前行星小于0 （确保方向相反）
        while (alive && stack.length > 0 && stack[stack.length - 1] > 0 && asteroid < 0) {
            //这个条件给stack里的元素 如果》= 那直接没了
            if (stack[stack.length - 1] >= -asteroid) {
                alive = false;
            }
            //这个条件给当前行星 主要看是否alive 两个条件都包含等于 这样就当相等时 我们可以一边pop元素 一边让当前行星不alive
            if (stack[stack.length - 1] <= -asteroid) {
                stack.pop();
            }
        }
        // 如果alive就push
        if (alive) {
            stack.push(asteroid);
        }
    }
    return stack;
}

// TC: O(N) SC: O(N)


// leetcode 53: DP
// Destructure: 寻找状态共识： dp[i] = Max(前一个+当前的（要之前的）， 只要当前的)
function maxSubArray(nums) {
    const dp = Array(nums.length).fill(0);
    dp[0] = nums[0];
    let result = dp[0];
    for (let i = 1; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
        result = Math.max(result, dp[i]);
    }
    return result;
}
// TC: O(N) SC: O(N)

// leetcpde 300;
// Destructure: 有点像是dp的思路 用一个tail的数组记录数组位置当前可放的最小值 每遍历新的数字的时候 查找是否可以更新tail中的数字
// 注意：tail中的不是存放着连续增长的子数组 
//思考： 为什么后面的数字更新tail中前面位置的数字不影响结果呢 ： 例如现在长度为4了 现在更新3 是因为当tail变成4的时候 我已经记录当前的length了 就是4 
//更新3 1.不影响之前保存的结果 2.同时尽可能把数组降低 从而尽量找到更长的数组

function lengthOfLIS(nums) {
    const tails = Array(nums.length).fill(0);
    //指针记录当前数组长度
    let result = 0;
    for (const num of nums) {
        let left = 0;
        let right = result - 1;
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            //找数组中是否存在比num大的数字
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        // 如果找到了 left就是在更新的位置 如果没有 left就在tail的后一位
        tails[left] = num;
        //没找的话 当前num放到tail中 更新长度 +1
        if (left === result) {
            result += 1;
        }
    }
    return result;
}
// TC: O(N⋅log(N)) SC: O(N) 每个元素调用一次二分就是N⋅log(N)


//leetcode 207:  topologic sort
// Destructure:  现寻找indegree 再建立单向图 然后建立queue 把indegree为0的点push进去 开始bfs 每次shift一个点 counter ++ 然后查找neighbor  
// neighbor的indegree相对应-1 如果为0 push进去 最后检查counter是否和numsCourse一样 一样为true 不一样则有环 说明无法完成课程
function canFinish(numCourses, prerequisites) {
    const indegree = Array(numCourses).fill(0);
    const graph = Array(numCourses).fill(0).map((_) => []);
    for (const prerequisite of prerequisites) {
        indegree[prerequisite[0]]++;
        graph[prerequisite[1]].push(prerequisite[0]);
    }
    let counter = 0;
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }

    while (queue.length !== 0) {
        const course = queue.shift();
        counter++;
        for (const neighbor of graph[course]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    // 可能有环 所以要检查完成的课程是否与所有课程一致
    return counter === numCourses;
}


// 面经 滑动窗口
function collectApple(buckets, target) {
    if (buckets.length === 0) {
        return [];
    }
    let left = 0;
    let sum = 0;
    for (let right = 0; right < buckets.length; right++) {
        sum += buckets[right];
        while (sum > target) {
            sum -= buckets[left];
            left++;
        }
        if (sum === target) {
            return buckets.slice(left, right + 1);
        }
    }
    return [];
}
console.log(solution(9, [2, 3, 4, 5, 6, 2, 3])); // 输出: [2, 3, 4]
console.log(solution(7, [2, 3, 4, 5, 6, 2, 3])); // 输出: [3, 4]
console.log(solution(6, [1, 2, 3]));             // 输出: [1, 2, 3]
console.log(solution(6, [1, 2, 2]));             // 输出: []
console.log(solution(1, [1]));                   // 输出: [1]
console.log(solution(1, [1, 2]));                // 输出: [1]
console.log(solution(2, [1, 2]));                // 输出: [2]


//leetcode 739  单调栈 ->
// 如果栈中的元素比当前元素小 直接pop 这样我们就可以再栈中形成一个单调排列
// 当我们遇到比栈中最后一个元素大的一天的时候 我们就可以把栈中村的indexpop 出来做计算了
function dailyTemperatures(temperatures) {
    const stack = [];
    result = Array(temperatures.length).fill(0);

    for (let i = 0; i < temperatures.length; i++) {
        while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[i]) {
            const index = stack.pop();
            result[index] = i - index;
        }
        stack.push(i);
    }
    return result;
}
// Time complexity: O(N) Space complexity: O(N)

// leetcode 91 Decode ways  DP
// 当前字符也就有三种组合方式 1. 自己是一个字符 2.必须跟前一位组合 3. 1和2都行
// 因为字母就26个 且从左往右便利 所以不考虑当前i右边的值
function numDecodings(s) {
    if (s[0] === '0') return 0;
    const n = s.length;
    const dp = Array(s.length + 1).fill(0);
    // 代表字符串不同长度的切割方式
    dp[0] = 1;
    // 空字符串也是做一次分割 就是1
    dp[1] = 1;
     // 一个字符串为1

    
    for (let i = 2; i <= n; i++) {
         //类型1
        if (s[i - 1] >= ' 1' && s[i - 1] <= 9) {
            dp[i] += dp[i - 1];
        }
        //类型 2 // +=即为类型3
        const twoDigit = s.slice(i - 2, i);
        if (twoDigit >= ' 10' || twoDigit <= ' 26') {
            dp[i] += dp[i - 2];
        }
        // 为什么是 i - 2 到 i呢 这个是找的在s中组成当前长度的下标位置：
        // 打个比方 当前字符串长度为2的时候 s的下标是从 s.slice(0, 2) 组成长度为2的字符串
    }
    return dp[s.length]
}
// Time complexity: O(N) Space complexity: O(N)


// leetcode 236 
// Destructure: 我们要先看两边子节点 在看中间-》 后序遍历 
// 情况1： p , q 在 root两侧 
// 情况2:  p是q的祖先（会在最初的判断p q上返回p 而不进行遍历q， 因为这种情况+根据题目说一定会有pq q一定在p的下面， 不然就是情况1）
function lowestCommonAncestor(root, p, q) {
    if (root === null) {
        return null;
    }
    if (root === q || root === p) {
        return root;
    }
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    // 左右不为空 当前root就是公共祖先
    if (right !== null && left !== null) {
        return root;
    // 右不为空，左空 右子树上传给上面进行判断
    } else if (right !== null && left === null) {
        return right;
    // 左不为空，右空 左子树上传给上面进行判断
    } else if (left !== null && right === null) {
        return left;
    //两边都为空 那就返回null
    } else {
        return null;
    }
}

// leet 215: heap || partition
// Destructure: heap的操作是O(nlogn) partition是O(n)主要思想是 找第k大的——》寻找数组中下标为len - k的数字 所以partition可以帮我们快速定位

function sawp(nums, index1, index2) {
    const temp = nums[index1];
    nums[index1] = nums[index2];
    nums[index2] = temp;
}

function partition(nums, left, right) {
    const randomIndex = left + Math.floor(Math.random() * (right - left - 1)); //随机选取一个数字当做参照物
    // 交换位置 让randomIndex的数字在开头
    sawp(nums, left, randomIndex);
    const pivot = nums[left];
    // 两个指针开始运行
    let leftPointer = left + 1;
    let rightPointer = nums.length - 1;

    while (true) {
        // 如果left < 选中的数字 往前
        while (leftPointer <= rightPointer && nums[leftPointer] < pivot) {
            leftPointer++;

        }
        // 如果 right > 选中的数字 往后
        while (leftPointer <= rightPointer && nums[rightPointer] > pivot) {
            rightPointer--;
        }
        // 因为while条件是true 要办判断边界
        if (leftPointer >= rightPointer) {
            break;
        }
        // 此时left指向的是 大于pivot的数字 right指向的是小于pivot的数字 所以交换
        sawp(nums, leftPointer, rightPointer);
        leftPointer++;
        rightPointer--;
    }
    // 最后再交换回去
    sawp(nums, left, rightPointer);
    // 返回当前分割的位置
    return rightPointer;
}
function findKthLargest(nums, k) {
    const len = nums.length;
    let left = 0;
    let right = len - 1;
    let target = len - k;

    while (true) {
        const pivotIndex = partition(nums, left, right);
        if (pivotIndex === target) {
            return nums[pivotIndex];
        } else if (pivotIndex < target) {
            left = pivotIndex + 1;
        } else {
            right = pivotIndex - 1;
        }
    }
}

// leetcode 1249 stack
// Destructure： 看见括号问题 我们首先想到的就是 stack 消除 虽然这个题有说min的字样  但是也是要建立在valid括号的基础上 一旦按照规则改成valid
// 其实也就是min的remove
function minRemoveToMakeValid(s) {
    const leftBracket = [];
    const rightBracket = [];
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (char === '(') {
            leftBracket.push(i);
        } else if (char === ')') {
            if (left.length === 0) {
                rightBracket.push(i);
            } else {
                leftBracket.pop();
            }
        }
    }

    let result = '';
    for (let i = 0;i < s.length; i++) {
        if (i === leftBracket[0]) {
            leftBracket.shift();
        } else if (i === right[0]) {
            rightBracket.shift();
        } else {
            result += s[i];
        }
    }
    return result;
}
// 最优解是第一遍遍历 从左往右消除右括号 同时记录非法做括号数量 第二次遍历 从右往左 消除非法多余左括号 ： 多余的左括号出现在右括号之后，但没有与右括号配对成功。 从右向左检查时，所有合法的括号对已经闭合，因此只需要简单地跳过这些多余的左括号即可。

// Time complexity: O(N) Space complexity: O(1)

// leetcode 79 graph + dfs seach + 回溯
// Destructure：dfs 注意事项 参数多一个i代表当匹配的字符是word的第几位 还有回溯-》 保存当前字符串 结束遍历后复原
function exist(board, word) {
    const m = board.length;
    const n = board[0].length;
    //全局变量 找到时直接true
    let isFound = false;
    const dfs  = (i, j, index) => {
        if (i < 0 || i >= m || j < 0 || j >= n) {
            return;
        }
        if (board[i][j] === '*') {
            return;
        }
        if (index !== board[i][j] || isFound) {
            return;
        }
        // 如果遍历到最后一个字符了 （上面已经判定是否等于了）update flag return
        if (index === word.length - 1) {
            isFound = true;
            return;
        }
        //保存当前棋盘字符
        const char = board[i][j];
        // 沉默字符
        board[i][j] = '*';
        dfs(i, j + 1, index + 1);
        dfs(i, j - 1, index + 1);
        dfs(i + 1, j, index + 1);
        dfs(i - 1, j, index + 1);
        // 回溯 以便其他路径使用
        board[i][j] = char;
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === word[0]) {
                dfs(i, j, 0);
                if (isFound) {
                    return true;
                }
            }
        } 
    }
    return false;
}

// leetcode 56: stack + sort + interval
// Destructure：经典题 把merge好的stack放到stack中 在比较下个interval的时候 比较下一个interval的[0]是否大于等于stack最后一个interval的[1]
function merge(intervals) {
    if (intervals.length === 0) {
        return [];
    }
    intervals.sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < intervals.length; i++) {
        if (i === 0 || intervals[i][0] > result[result.lenght - 1][1]) {
            result.push(intervals[i]);
        } else {
            // 注意： 有两种情况 一个是当前interval[1]大于array最后的[1] 
            // 也有可能是array 最后一位[1]大于当前interval[1] [2,17],[8,10]
            result[result.length - 1][1] = Math.max(result[result.length - 1][1], intervals[i][1]);
        }
    }
    return result;
}
// Time complexity: O(NlogN) SC: O(n)

// leetcode: 1539 binary search
// Destructure: 这道题主要是通过判断arr[mid] - mid - 1 去判断截止到当前mid 前面还miss了多少数字
// 例如[5...] 5 - 0 - 1 = 4 说明5之前有四个数字miss 那么我们就可以通过二分找到接近k的数字最近下标
function findKthPositive(arr, k) {
    if (arr[0] > k) {
        return k;
    }

    let left = 0;
    let right = arr.length - 1;
    while ( left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        // 如果说当前缺失数字小于k
        if (arr[mid] - mid - 1 < k) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        // 最后left指向的是最近一个大于等于 k下标的一个数字
    }

    // 当前数字 - （当前数字 - 下标 - k）第五个数 但其实是下标为4 所以不多-1了
    // return arr[left] - (arr[left] - left - k); //arr[n-1] + k - arr[n-1] + n
    return left + k;
}
// Time complexity: O(logN) SC: O(1)

// Leetcode 2530: heap
// Destructure: 比较直观 每次操作完以后 更新分数 再把当前数字/3扔进堆中
function maxKelements(nums, k) {
    const q = new MaxPriorityQueue();
    let ans = 0;
    for (const num of nums) {
        q.enqueue(num);
    }
    for (let i = 0; i < k; i++) {
        const x = q.dequeue().element;
        ans += x;
        q.enqueue(Math.ceil(x / 3));
    }
    return ans;
}
//  Time complexity: O(N∗Log(N)) Space complexity: O(n)



// leetcode 1151: sliding window
// Destructure: 先遍历一边array寻找出所有1的数量 -> 查找sub array中含0最少的 且长度为数组中所有1的数量
function minSwaps(data) {
    let countOnes = 0;
    for (const num of data) {
        if (num === 1) {
            countOnes++;
        }
    }
    if (countOnes === 0 || countOnes === 1) {
        return 0;
    }
    let left = 0;
    let zeros = 0;
    let result = Infinity;
    for (let right = 0; right < data.length; right++) {
        if (data[right] === 0) {
            zeros++;
        }
        if (right - left + 1 === countOnes) {
            result = Math.min(result, zeros);
            if (data[left] === 0) {
                zeros--;
            }
            left++;
        }
    }
    return result;
}


