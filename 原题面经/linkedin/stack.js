function isValid(s) {
    if (s.length === 0) {
        return true;
    }
    const dict = {
        '(': ')',
        '[': ']',
        '{': '}'
    };

    const stack = [];
    for (const char of s) {
        if (dict[char]) {
            stack.push(char);
        } else {
            const lastBracket = stack.pop();
            if (dict[lastBracket] !== char) {
                return false;
            }
        }
    }
    return stack.length === 0;
}

function flatten(arr) {
    if (arr.length === 0) {
        return [];
    }
    const result = [];
    for (const element of arr) {
        if (Array.isArray(element)) {
            result.push(...flatten(element));
        } else {
            result.push(element);
        }
    }
    return result;
}



function isValidTree(node) {
    for (const key in node) {
        const value = node[key];
        if (typeof value === 'string') {
            if (!isValid(value)) {
                return false;
            }
        } else if (typeof value === 'object' && value !== null) {
            if (!isValidTree(value)) {
                return false;
            }
        }
    }
    return true;
}

const tree = {
  s1: '([])',
  s2: {
    s3: '{[(]}',
  },
  s4: ''
};

console.log(isValidTree(tree)); 

const tree2 = {
  a: '([])',
  b: {
    c: '{[()]}', // ✅
  },
  d: ''
};

console.log(isValidTree(tree2));