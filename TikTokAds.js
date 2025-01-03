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


