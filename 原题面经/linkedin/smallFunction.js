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


function isParent(parent, children) {
    let current = children;

    while (current) {
        if (current === parent) {
            return true;
        }

        current = current.parentNode;
    }

    return false;
}


function repear(str, n) {
    str = String(str);
    n = Math.floor(n);
    if (n <= 0 || !isFinite(n)) {
        return '';
    }

    let result = '';
    while (n > 0) {
        if (n % 2 === 1) {
            result += str;
        }
        str += str;
        n = Math.floor(n / 2);
    }
    return result;
}

console.log(flatten([1,2,[3,4,[5,[6]],7],8,9]))