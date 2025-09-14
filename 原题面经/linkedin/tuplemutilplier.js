class TupleMultiplier {
    constructor(inputStr) {
        // this.tuple = inputStr.split('),(').map(s => s.replace(/[()]/g, '')).map(s.split(',').map(Number));
        const parts = inputStr.split("),(");
        this.tuple = parts.map((part, idx) => {
        // 第一个和最后一个需要去掉外括号
        if (idx === 0) part = part.slice(1);         // 去掉第一个 (
        if (idx === parts.length - 1) part = part.slice(0, -1); // 去掉最后一个 )
        return part.split(",").map(Number);
        });
    }

    multiply(n) {
        if (this.tuple.length === 0) {
            return 0;
        }

        if (n < 1 || n > this.tuple[0].length) {
            throw new Error(`Index out of range: ${n}`);
        }


        const index = n - 1;
        return this.tuple.reduce((product, tuple) => product * tuple[index], 1);
    }
}
const input = "(1,2,3),(4,5,6),(7,8,9)";
const tm = new TupleMultiplier(input);

console.log(tm.multiply(2)); // 输出 80 （2 * 5 * 8）
console.log(tm.multiply(1)); // 输出 28 （1 * 4 * 7）
console.log(tm.multiply(3)); // 输出 162 （3 * 6 * 9）
