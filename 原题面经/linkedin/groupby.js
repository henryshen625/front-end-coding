const endorsements = [
  { skill: 'css', user: 'Bill' },
  { skill: 'javascript', user: 'Chad' },
  { skill: 'javascript', user: 'Bill' },
  { skill: 'css', user: 'Sue' },
  { skill: 'javascript', user: 'Sue' },
  { skill: 'html', user: 'Sue' }
];


function groupBy(endorsements) {
    const skillMap = new Map();
    for (const { skill, user } of endorsements) {
        if (!skillMap.has(skill)) {
            skillMap.set(skill, new Set());
        }
        skillMap.get(skill).add(user);
    }

    const result = [];
    for (const [skill, userSet] of skillMap.entries()) {
        result.push({
            skill,
            user: Array.from(userSet),
            count: userSet.size
        })
    }
    result.sort((a, b) => b.count - a.count);
    return result;
}

console.log(groupBy(endorsements));
