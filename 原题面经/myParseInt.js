function myParseInt(str) {
    // 使用正则表达式匹配字符串中的第一个连续的数字
    const match = str.match(/\d+/);

    // 如果没有匹配到数字，返回0
    if (!match) {
        return 0;
    }

    // 手动将匹配到的数字字符串转换为整数
    let numStr = match[0];
    let number = 0;
    let multiplier = 1;

    // 从右到左解析每个字符
    for (let i = numStr.length - 1; i >= 0; i--) {
        let digit = numStr[i] - '0'; // 将字符转换为数字
        number += digit * multiplier;
        multiplier *= 10; // 每次乘以10来移动到下一位
    }

    return number;
}

function myParseInt2(str) {
    let foundNumber = false;
    let numberStr = '';
    
    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char >= '0' && char <= '9') {
            numberStr += char;
            foundNumber = true;
        } else if (foundNumber) {
            // 如果已经找到一个数字串并且当前字符不是数字，停止查找
            break;
        }
    }
    // 如果没有找到数字串，返回 0
    if (numberStr === '') {
        return 0;
    }
    // 手动将数字字符串转换为整数
    let number = 0;
    let multiplier = 1;

    // 从右到左解析每个字符
    for (let i = numberStr.length - 1; i >= 0; i--) {
        let digit = numberStr[i] - '0'; // 将字符转换为数字
        number += digit * multiplier;
        multiplier *= 10; // 每次乘以10来移动到下一位
    }

    return number;
}

function extractFirstNumberFromString(str) {
    const digits = '0123456789';
    let foundNumber = false;
    let numberStr = '';
    
    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (digits.indexOf(char) !== -1) {
            numberStr += char;
            foundNumber = true;
        } else if (foundNumber) {
            // 如果已经找到一个数字串并且当前字符不是数字，停止查找
            break;
        }
    }

    // 如果没有找到数字串，返回 0
    if (numberStr === '') {
        return 0;
    }

    // 手动将数字字符串转换为整数
    let number = 0;
    let multiplier = 1;

    // 从右到左解析每个字符
    for (let i = numberStr.length - 1; i >= 0; i--) {
        let digit = digits.indexOf(numberStr[i]); // 使用字符串数组索引将字符转换为数字
        number += digit * multiplier;
        multiplier *= 10; // 每次乘以10来移动到下一位
    }

    return number;
}

// 测试用例
// console.log(myParseInt2("xxxx123xxx780")); // 输出: 123
// console.log(myParseInt2("abc def ghi"));   // 输出: 0
// console.log(myParseInt2("    456abc"));    // 输出: 456
// console.log(myParseInt2("abc789def123"));  // 输出: 789
// console.log(myParseInt2("    "));          // 输出: 0
// console.log(myParseInt2("abc123"));        // 输出: 123
// console.log(myParseInt2("456abc123"));     // 输出: 456

console.log(extractFirstNumberFromString("xxxx123xxx780")); // 输出: 123
console.log(extractFirstNumberFromString("abc def ghi"));   // 输出: 0
console.log(extractFirstNumberFromString("    456abc"));    // 输出: 456
console.log(extractFirstNumberFromString("abc789def123"));  // 输出: 789
console.log(extractFirstNumberFromString("    "));          // 输出: 0
console.log(extractFirstNumberFromString("abc123"));        // 输出: 123
console.log(extractFirstNumberFromString("456abc123"));     // 输出: 456



function myParseInt(input) {
    // 转换输入为字符串并移除两端空格
    const str = String(input).trim();
  
    if (!str) return NaN; // 空字符串返回 NaN
  
    let index = 0;
    let sign = 1; // 默认正数
  
    // 检查是否有正负号
    if (str[index] === '-' || str[index] === '+') {
      sign = str[index] === '-' ? -1 : 1;
      index++;
    }
  
    // 提取有效数字部分
    let numStr = '';
    while (index < str.length && '0123456789'.includes(str[index])) {
      numStr += str[index];
      index++;
    }
  
    // 如果没有提取到有效数字，返回 NaN
    if (!numStr) return NaN;
  
    // 将提取的字符串转换为整数并加上符号
    return sign * numStr.split('').reduce((acc, char) => acc * 10 + (char - '0'), 0);
  }
  