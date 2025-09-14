function calculate(s) {
    let res = 0;
    let sign = 1;
    const stack = [];
    let i = 0;

    while (i < s.length) {
        const ch = s[i];
        if (ch === ' ') {
            i++;
        } else if (ch === '+') {
            sign = 1;
            i++;
        } else if (ch === '-') {
            sign = -1;
            i++;
        } else if (ch === '(') {
            stack.push(res);
            stack.push(sign);
            res = 0;
            sign = 1;
            i++;
        } else if (ch === ')') {
            const prevSign = stack.pop();
            const prevRes = stack.pop();
            res = prevRes + prevSign * res;
            i++;
        } else {
            let num = 0;
            while (i < s.length && s[i] >= '0' && s[i] <= '9') {
                num = num * 10 + Number(s[i]);
                i++;
            }
            res += sign * num;
        }
    }
    return res;
}