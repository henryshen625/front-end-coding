function myInstanceOf(left, right) {
    if (typeof left !== 'object' || left === null) return false;

    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto === right.prototype) return true;

        if (proto === null) return false;

        proto = Object.getPrototypeOf(proto);
    }
}

console.log(myInstanceOf([], Array));
console.log(myInstanceOf({}, Object));
console.log(myInstanceOf([], Object));
console.log(myInstanceOf({}, Array));
