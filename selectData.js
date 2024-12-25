function setHasOverlap(setA, setB) {
    // Bundler doesn't transpile properly when doing for-of for sets.
    for (const val of Array.from(setA)) {
      if (setB.has(val)) {
        return true;
      }
    }
  
    return false;
  }
  
  /**
   * @param {Array<{user: number, duration: number, equipment: Array<string>}>} sessions
   * @param {{user?: number, minDuration?: number, equipment?: Array<string>, merge?: boolean}} [options]
   * @return {Array}
   */
  export default function selectData(sessions, options = {}) {
    const reversedSessions = sessions.slice().reverse(); // Make a copy and reverse.
    const sessionsForUser = new Map();
    const sessionsProcessed = [];
  
    reversedSessions.forEach((session) => {
        // 如果如要合并 且 当前user已经出现过了
      if (options.merge && sessionsForUser.has(session.user)) {
        const userSession = sessionsForUser.get(session.user);
        userSession.duration += session.duration;
        session.equipment.forEach((equipment) => {
          userSession.equipment.add(equipment);
        });
      } else {
        const clonedSession = {
          ...session,
          equipment: new Set(session.equipment), //用set来过滤重复元素
        };

        //如果有merge选项的话 需要用user map映射
        if (options.merge) {
          sessionsForUser.set(session.user, clonedSession);
        }
  
        sessionsProcessed.push(clonedSession);
      }
    });
  
    sessionsProcessed.reverse();
  
    const results = [];
    //给当前option filter过滤且做成set
    const optionEquipments = new Set(options.equipment);
    sessionsProcessed.forEach((session) => {
      if (
        // 如果user不是null 且当前session不是option的user
        (options.user != null && options.user !== session.user) ||
        // 如果当前option equipment的长度大于0 且 没有任何交集
        (optionEquipments.size > 0 &&
          !setHasOverlap(optionEquipments, session.equipment)) ||
          // session的总duration没有超过minDuration
        (options.minDuration != null && options.minDuration > session.duration)
      ) {
        return;
      }
  
      results.push({
        ...session,
        equipment: Array.from(session.equipment).sort(),
      });
    });
  
    return results;
  }
  