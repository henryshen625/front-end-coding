/*
sort version：
example
["1.0.1" , "2.3", "2.2.1"]
输出
["1.0.1" , "2.2.1","2.3"] 
*/

function compareVersions(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  const maxLength = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLength; i++) {
    const aVal = aParts[i] ?? 0;
    const bVal = bParts[i] ?? 0;
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
  }

  return 0;
}

const versions = ["1.0.1", "2.3", "2.2.1"];
versions.sort(compareVersions);
console.log(versions);

// follow up 1: 如果有pre-release version，按字母顺序
//["1.0.1-beta" , "1.0.1-cat", 1.0.1" , "6.3", "2.2.1"]
//["1.0.1-beta" , "1.0.1-cat", 1.0.1" , "2.2.1", "6.3", ]

function parseVersion(version) {
  const [main, pre] = version.split('-');
  const nums = main.split('.').map(Number);
  return { nums, pre };
}

function compareVersions(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);

  const maxLen = Math.max(va.nums.length, vb.nums.length);
  for (let i = 0; i < maxLen; i++) {
    const aVal = va.nums[i] ?? 0;
    const bVal = vb.nums[i] ?? 0;
    if (aVal !== bVal) return aVal - bVal;
  }

  // 如果版本数字完全相同，比较长度
//   if (aParts.length !== bParts.length) {
//     return aParts.length - bParts.length; // 短的更小 如果需求是1.2比 1.2.0 小
//   } 

  // Main versions are equal, now compare pre-release
  if (va.pre === undefined && vb.pre === undefined) return 0;
  if (va.pre === undefined) return 1;  // a > b
  if (vb.pre === undefined) return -1; // a < b

  return va.pre.localeCompare(vb.pre);
}

const versions1 = ["1.0.1-beta", "1.0.1-cat", "1.0.1", "6.3", "2.2.1"];
versions1.sort(compareVersions);
console.log(versions1);


//follow up 2: 递减排序

function compareVersionsDesc(a, b) {
  return compareVersions(b, a);
}


const versions3 = ["1.0.1-beta", "1.0.1-cat", "1.0.1", "6.3", "2.2.1"];
versions3.sort((a, b) => compareVersionsDesc(a, b));
console.log(versions3);



const versions5 = ["1.0.1-beta" , "1.0.1-cat", "1.0.1" ,"1.2-alpha", "6.3", "2.2.1"]


// follow up 1: 如果有pre-release version，按字母顺序
//["1.0.1-beta" , "1.0.1-cat", 1.0.1" , "6.3", "2.2.1"]
//["1.0.1-beta" , "1.0.1-cat", 1.0.1" , "2.2.1", "6.3", ]

function parseVersions(version) {
    const [numberString, alpha] = version.split('-');
    const number = numberString.split('.');
    return { number, alpha };
}

function baseSort(versionA, versionB) {
    const versionAObj = parseVersions(versionA);
    const versionBObj = parseVersions(versionB);

    const len = Math.max(versionAObj.number.length, versionBObj.number.length);

    for (let i = 0; i < len; i++) {
        const a = parseInt(versionAObj.number[i]) || 0;
        const b = parseInt(versionBObj.number[i]) || 0;
        if (a < b) {
            return - 1;
        }
        if (a > b) {
            return 1;
        }
    }
    if (versionAObj.number.length !== versionBObj.number.length) {
        return versionAObj.number.length - versionBObj.number.length;
    }
    if (versionAObj.alpha === undefined && versionBObj.alpha === undefined) {
        return 0;
    }
    if (versionAObj.alpha === undefined && versionBObj.alpha !== undefined)  {
        return 1;
    }   
    if (versionAObj.alpha !== undefined && versionBObj.alpha === undefined) {
        return -1;
    }
    return versionAObj.alpha.localeCompare(versionBObj.alpha);
}

console.log('123:', versions5.sort(baseSort));