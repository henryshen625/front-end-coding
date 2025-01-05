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

