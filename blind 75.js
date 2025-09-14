// leetcode 128: 遍历set 去重
function longestConsecutive(nums) {
    if (nums.length === 0 || nums.length === 1) {
        return nums.length;
    }
    const set = new Set(nums);
    let result = 0;
    for (const num of set) {
        if (!set.has(num - 1)) {
            let counter = 1;
            let current = num;
            while (set.has(current + 1)) {
                counter++;
                current++;
            }
            result = Math.max(result, counter);
        }
    }
    return result;
}

// leetcode 1:

var twoSum = function(nums, target) {
    if (nums.length === 0) {
        return [-1, 1];
    }

    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if (map.has(target - num)) {
            return [map.get(target - num), i];
        } else {
            map.set(num, i);
        }
    }

    return [-1, 1];
};


// leetcode 3:
function lengthOfLongestSubstring(s) {
    if (s.length === 0) {
        return 0;
    }
    const map = new Map();
    let left = 0;
    let result = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        map.set(char, (map.get(char) || 0) + 1);
        if (right - left + 1 <= map.size) {
            result = Math.max(result, right - left + 1);
        }
        while (right - left + 1 > map.size) {
            const charLeft = s[left];
            map.set(charLeft, map.get(charLeft) - 1);
            if (map.get(charLeft) === 0) {
                map.delete(charLeft);
            }
            left++;
        }
    }
    return result;
}

// leeetcode 133: 可以之后添加题解
var cloneGraph = function(node) {
    if (node === null) {
        return node;
    }
    const queue = [node];
    const map = new Map();
    const newRoot = new _Node(node.val, []);
    map.set(node, newRoot);
    while (queue.length > 0) {
        const current = queue.shift();
        for (const neighbor of current.neighbors) {
            if (!map.has(neighbor)) {
                const newNode = new _Node(neighbor.val, []);
                map.set(neighbor, newNode);
                queue.push(neighbor);
            }
            map.get(current).neighbors.push(map.get(neighbor));
        }
    }
    return newRoot;
};

// leetcode 5:
function longestPalindrome(s) {
    let n = s.length;
    if (n === 0) {
        return '';
    }

    let start = 0;
    let maxLength = 1;
    const dp = Array.from({ length: n }, () => Array(n).fill(false));
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    for (let i = n; i >= 0; i --) {
        for (let j = i + 1; j < n; j++) {
            if (s[i] === s[j]) {
                if (j - i <= 1 || dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                }
                if (j - i + 1 > maxLength) {
                    maxLength = j - i + 1;
                    start = i;
                }
            } 
        }
    }
    return s.subString(start, start + maxLength);
}

// leetcode 261:
var validTree = function(n, edges) {
    if (n - 1 !== edges.length) {
        return false;
    }
    const graph = Array.from({ length: n }, () => []);
    for (const [x, y] of edges) {
        graph[x].push(y);
        graph[y].push(x);
    }
    const visited = new Set();
    function dfs(node) {
        if (visited.has(node)) {
            return;
        }
        visited.add(node);
        for (const neighbor of graph[node]) {
            dfs(neighbor);
        }
    } 

    dfs(0);
    return visited.size === n;
};
 
// leetcode 11:双指针
function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;

    while (left < right) {
        const area = Math.min(height[left], height[right]) * (right - left); // 取最小-》木桶
        maxArea = Math.max(area, maxArea);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}

//leetcode 15: three pointer:
function threeSum(nums) {
    if (nums.length === 0) {
        return [];
    }

    nums.sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            break;
        }
        if (i !== 0 && nums[i] === nums[i - 1]) {
            continue;
        }

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) {
                    left++;
                }
                while (left < right && nums[right] === nums[right - 1]) {
                    right--;
                }
                left++;
                right--;
            }
        }
    }
    return result;
}


//leetcode 139: 
//dp:
function wordBreak(s, wordDict) {
    const set = new Set(wordDict);
    const dp = Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            const word = s.substring(j, i);
            if (set.has(word) && dp[j]) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length];
}
// backtracking: 
function wordBreak(s, wordDict) {
    const set = new Set(wordDict);
    const memo = Array(s.length).fill(null);
    function backtracking(index) {
        if (index === s.length) {
            return true;
        }
        if (memo[index] !== null) {
            return memo[index]
        }

        for (let i = index + 1; i <= s.length; i++) {
            const subString = s.slice(index, i);
            if (set.has(subString) && backtracking(i)) {
                memo[index] = true;
                return true;
            }
        }
        memo[index] = false;
        return false;
    }
    return backtracking(0);
}
// leetcode 141: 快慢指针
function hasCycle(head) {
    if (head === null) {
        return false;
    }

    let fast = head;
    let slow = head;
    while (fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
        if (fast === slow) {
            return true;
        }
    }
    return false;
}

// leetcode 268:
var missingNumber = function(nums) {
    let realSum = 0;
    const n = nums.length;

    for (const num of nums) {
        realSum += num;
    }
    let exceptSum = Math.floor( n* (n + 1))/2;
    return exceptSum - realSum;
};

// leetcode 48: 背
var rotate = function(matrix) {
    const n = matrix.length;
    for (let i = 0; i < Math.floor(n /2); i++) {
        for(let j = 0; j < Math.floor((n + 1) /2); j++) {
            const temp = matrix[i][j];
            matrix[i][j] = matrix[n - j - 1][i];
            matrix[n - j - 1][i] = matrix[n - i - 1][n - j -1];
            matrix[n - i - 1][n - j -1] = matrix[j][n - i - 1];
            matrix[j][n - i - 1] = temp;
        }
    }
};

// leetcode 102:
function levelOrder(root) {
    if (root === null) {
        return [];
    }

    const queue = [root];
    const result = [];

    while (queue.length > 0) {
        const currentLevel = queue.length;
        const temp = [];
        for (let i = 0; i < currentLevel; i++) {
            const node = queue.shift();
            temp.push(node.val);
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
        result.push(temp);
    }
    return result;
}

//leetcode 19:
// 注意要使用dummy 确保当head = [1] 有地方可去
var removeNthFromEnd = function(head, n) {
    let dummy = new ListNode(-1);
    dummy.next = head;
    let fast = dummy;
    let slow = dummy;

    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }

    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
};

// leetocde 20:
function isValid(s) {
    if (s.length === 0) {
        return true;
    }

    const map = {
        '(' : ')',
        '[': ']',
        '{': '}'
    };

    const stack = [];

    for (let i = 0; i < s.length; i++) {
        const bracket = s[i];
        if (map[s[i]]) {
            stack.push(bracket)
        } else {
            const rightBracket = stack.pop();
            if (map[rightBracket] !== bracket) {
                return false;
            }
        }
    }
    return stack.length === 0;
}

// leetcode 21:
function mergeTwoLists(list1, list2) {
    if (!list1) {
        return list2;
    }
    if (!list2) {
        return list1;
    }
    if (list1.val < list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
}
// 方法2: 双指针


//leetcode 53:
function maxSubArray(nums) {
    const dp = Array(nums.length).fill(0);
    dp[0] = nums[0];
    for (let i = 1; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
    }
    return Math.max(...dp);
}

//leetcode 143:
var reorderList = function(head) {
    if (head === null) {
        return null;
    }

    let slow = head;
    let fast = head;
    
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    let current = slow.next;
    slow.next = null;
    let prev = null;

    while (current) {
        const temp = current.next;
        current.next = prev;
        prev = current;
        current = temp;
    }
    
    let list1 = head;
    let list2 = prev;

    while (list1 && list2) {
        // 保留l1的剩下部分
        const temp1 = list1.next;
        //l1当前接l2
        list1.next = list2;
        // 转移头到剩下的l1
        list1 = temp1;
        // 保留l2剩下部分
        const temp2 = list2.next;
        // 把l1拼接到l2上
        list2.next = list1;
        // 转移头到剩下的l2
        list2 = temp2;
    }
    return head;
}


//leetcode 23:
function mergeKLists(lists) {
    if (lists.length === 0) {
        return null;
    }

    function mergeTwoList(l1, l2) {
        let dummy = new ListNode(-1);
        let current = dummy;
        while (l1 && l2) {
            if (l1.val <= l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }
        current.next = l1 ? l1 : l2;
        return dummy.next;
    }

    function merge(left, right) {
        if (left === right) {
            return lists[left];
        }

        const mid = Math.floor((right + left) / 2);
        const leftPart = merge(left, mid);
        const rightPart = merge(mid + 1, right);
        return mergeTwoList(leftPart, rightPart);
    }

    return merge(0, lists.length - 1);
}

// leetcode 435 
var eraseOverlapIntervals = function(intervals) {
    intervals.sort((a, b) => a[1] - b[1]);
    let prev = -Infinity;
    let result = 0;
    for (const [start, end] of intervals) {
        if (start >= prev) {
            prev = end;
        } else {
            // 为什么删除时候不更新end呢 是因为我们想保留更小的end 以此来换来更大的空间
            result++;
        }
    }
    return result;
};


// leetcode：49
function groupAnagrams(strs) {
    const map = new Map();
    for (const str of strs) {
        const ascii = getAscii(str);
        if (map.has(ascii)) {
            map.get(ascii).push(str)
        } else {
            map.set(ascii, [str]);
        }
    }
    return Array.from(map.values());
}

function getAscii(word) {
    const counter = Array(26).fill(0);
    for (const char of word) {
        counter[char.charCodeAt() - 'a'.charCodeAt()] += 1;
    }
    return counter.join('-');
}


// leetcode 300: REVIEW
function lengthOfLIS(nums) {
    const tails = Array(nums).fill(null);
    let result = 0;
    for (let i = 0; i < nums.length; i++) {
        let left = 0;
        let right = result - 1;

        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            if (tails[mid] < nums[i]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        tails[left] = nums[i];
        if (left === result) {
            result++;
        }
    }
    return result;
}

// leetcode 100:
function isSameTree(p, q) {
    if (p === null && q === null) {
        return true;
    } else if (p === null && q !== null) {
        return false;
    } else if (p !== null && q === null) {
        return false;
    } else if (p.val !== q.val) {
        return false;
    } 
    const left = isSameTree(p.left, q.left);
    const right = isSameTree(p.right, q.right);
    return left && right;
}

// leetcode 153: 参照物是nums[num.length - 1] 去寻找有序区间
var findMin = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((right + left) / 2);

        if (nums[mid] > nums[nums.length - 1]) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return nums[left];
};

// leetcode 57:

function insert(intervals, newInterval) {
    let i = 0;
    const result = [];
    while (i < intervals.length && newInterval[0] > intervals[i][1]) {
        result.push(intervals[i]);
        i++;
    }
    const temp = [...newInterval];
    while (i < intervals.length && temp[1] >= intervals[i][0]) {
        temp[0] = Math.min(temp[0], intervals[i][0]);
        temp[1] = Math.max(temp[1], intervals[i][1]);
        i++;
    }
    result.push(temp);
    while (i < intervals.length) {
        result.push(intervals[i]);
        i++;
    }
    return result;
}

// leetcode 217:

var containsDuplicate = function(nums) {
    if (nums.length === 0) {
        return false;
    }
    const map = new Set();

    for (const num of nums) {
        if (map.has(num)) {
            return true;
        }
        map.add(num);
    }
    return false;
};

// leetcode 124: inner 层： left + 中 + 右
// 往上穿 max(0, left + 中， 右 + 中)
function maxPathSum(root) {
    if (root === null) {
        return 0;
    }
    let result = -Infinity;

    function traverse(root) {
        if (root === null) {
            return 0;
        }
        const left = traverse(root.left);
        const right = traverse(root.right);
        const innerMAX = right + left + root.val;
        result = Math.max(result, innerMAX);

        return Math.max(0, root.val + left, root.val + right);
    }
    traverse(root);
    return result;
}


//leetcode 252:
var canAttendMeetings = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) {
            return false;
        }
    }
    return true;
};

// leetcode 104:
function maxDepth(root) {
    if (root === null) {
        return 0;
    }

    function dfs(root) {
        if (root === null) {
            return 0;
        }
    
        const left = dfs(root.left);
        const right = dfs(root.right);

        return Math.max(left, right) + 1;
    }

    return dfs(root);
}

// leetcode 226:
function invertTree(root) {
    if (root === null) {
        return null;
    }

    function dfs(root) {
        if (root === null) {
            return null;
        }
        const left = dfs(root.left);
        const right = dfs(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
    return dfs(root);
}


//leetcode 253
