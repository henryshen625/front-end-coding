/*
const comments = [
  new Comment(1, null),
  new Comment(2, null),
  new Comment(3, null),
  new Comment(4, 1),
  new Comment(5, 1),
  new Comment(6, 5),
  new Comment(7, 6),
  new Comment(8, 4)
];

1
├── 4
│   └── 8
├── 5
    └── 6
        └── 7
2
3
*/

class Comment {
  constructor(commentId, parentId) {
    this.id = commentId;
    this.parentId = parentId;
  }
}

class CommentTreeNode {
  constructor(comment, parent = null) {
    this.comment = comment; // Comment 实例
    this.parent = parent;   // 上层 CommentTreeNode 实例或 null
    this.children = [];     // 下层子节点
  }
}

function flatToTree(comments) {
    const map = new Map();
    const roots = [];

    for (const comment of comments) {
        map.set(comment.id, new CommentTreeNode(comment, null));
    }

    for (const comment of comments) {
        const node = map.get(comment.id);
        if (comment.parentId === null) {
            roots.push(node);
        } else {
            const parent = map.get(comment.parentId);
            node.parent = parent;
            parent.children.push(node);
        }
    }
    return roots;
}

const comments = [
  new Comment(1, null),
  new Comment(2, null),
  new Comment(3, null),
  new Comment(4, 1),
  new Comment(5, 1),
  new Comment(6, 5),
  new Comment(7, 6),
  new Comment(8, 4)
];

function printTree(commentNodes) {
  const lines = [];

  function dfs(nodes, depth) {
    for (const node of nodes) {
      lines.push(" ".repeat(depth * 2) + node.comment.id);
      if (node.children.length > 0) {
        dfs(node.children, depth + 1);
      }
    }
  }

  dfs(commentNodes, 0);
  return lines.join('\n');
}

const tree = flatToTree(comments);
// console.log(printTree(tree));


//follow up 1: 是乱序怎么办，也就是见过的这个id的parent_id还没出现过

function flatToTree(comments) {
  const idToNode = new Map();
  const roots = [];

  for (const comment of comments) {
    // 如果当前节点还未创建，就创建
    if (!idToNode.has(comment.id)) {
      idToNode.set(comment.id, new CommentTreeNode(comment, null));
    } else {
      // 已存在这个 id，只是现在补充 comment 数据
      idToNode.get(comment.id).comment = comment;
    }

    const currentNode = idToNode.get(comment.id);

    // 处理 parent
    if (comment.parentId === null) {
      roots.push(currentNode);
    } else {
      // 如果 parent 节点尚未创建，先占位
      if (!idToNode.has(comment.parentId)) {
        idToNode.set(comment.parentId, new CommentTreeNode(null, null));
      }

      const parentNode = idToNode.get(comment.parentId);
      currentNode.parent = parentNode;
      parentNode.children.push(currentNode);
    }
  }

  return roots;
}

// follow up 2: 是如果有图/有环怎么办

function flatToTree(comments) {
  const idToNode = new Map();
  const roots = [];

  for (const comment of comments) {
    if (!idToNode.has(comment.id)) {
      idToNode.set(comment.id, new CommentTreeNode(comment, null));
    } else {
      idToNode.get(comment.id).comment = comment;
    }

    const currentNode = idToNode.get(comment.id);

    if (comment.parentId === null) {
      roots.push(currentNode);
    } else {
      if (!idToNode.has(comment.parentId)) {
        idToNode.set(comment.parentId, new CommentTreeNode(null, null));
      }

      const parentNode = idToNode.get(comment.parentId);

      // ✅ Cycle Detection: ensure parent is not a descendant of currentNode
      if (hasCycle(currentNode, parentNode)) {
        console.warn(`Cycle detected: Comment ${comment.id} cannot have parent ${comment.parentId}`);
        continue; // Or throw error
      }

      currentNode.parent = parentNode;
      parentNode.children.push(currentNode);
    }
  }

  return roots;
}

function hasCycle(childNode, potentialParent) {
  let current = potentialParent;
  while (current !== null) {
    if (current === childNode) return true;
    current = current.parent;
  }
  return false;
}



/// 可能还会有些follow up是comment里包含timestamp？




function parseComments(comments) {
    const commentMap = new Map(); 
    
    for (const comment of comments) {
        commentMap.set(comment.id, new CommentTreeNode1(null, comment))
    }

    const result = [];
    for (const comment of comments) {
        const node = commentMap.get(comment.id);
        if (comment.parentId === null)  {
            result.push(node)
        } else {
            const parent = commentMap.get(comment.parentId);
            parent.children.push(node);
            node.parent = parent;
        }
    }
    return result;
}

function parseCommentsTreeNoOrder(comments) {
    if (comments.length === 0) {
        return 0;
    }
    const result = [];
    const treeMap = new Map();

    for (const comment of comments) {
        if (!treeMap.has(comment.id)) {
            treeMap.set(comment.id, new CommentTreeNode1(null, comment))
        } else {
            treeMap.get(comment.id).comment = comment;
        }
        
        const currentConmmentNode = treeMap.get(comment.id);
        if (comment.parentId === null) {
            result.push(currentConmmentNode);
        } else {
            if (!treeMap.has(comment.parentId)) {
                treeMap.set(comment.parentId, new CommentTreeNode1(null, null));
            }
            const parentNode = treeMap.get(comment.parentId);
            parentNode.children.push(currentConmmentNode);
            currentConmmentNode.parent = parentNode;
        }
    }
    return result;
}

function parseCommentsTreeCycle(comments) {
    if (comments.length === 0) {
        return [];
    }

    const result = [];
    const treeMap = new Map();

    for (const comment of comments) {
        if (!treeMap.has(comment.id)) {
            treeMap.set(comment.id, new CommentTreeNode1(null, comment));
        } else {
            treeMap.get(comment.id).comment = comment;
        }

        const currNode = treeMap.get(comment.id);
        if (comment.parentId === null) {
            result.push(currNode);
        } else {
            if (!treeMap.has(comment.parentId)) {
                treeMap.set(comment.parentId, new CommentTreeNode1(null, null));
            }

            const parent = treeMap.get(comment.parentId);
            if (detectCycle(currNode, parent)) {
                throw new Error("Cycle detected!");
            }
            parent.children.push(currNode);
            currNode.parent = parent;
        }
    }
}

function detectCycle(child, parent) {
    let curr = parent;
    while (curr !== null) {
        if (curr === child) {
            return true;
        }
        curr = curr.parent;
    }
    return false;
}

function travere(tree) {
    const result = [];
    function dfs(tree, depth) {
        for (const node of tree) {
            result.push(`${'  '.repeat(depth)}${node.comment.id}`);
            if (node.children.length > 0) {
                dfs(node.children, depth + 1);
            }
        }
    }
    dfs(tree, 0);
    return result.join('\n');
}


const comments1 = [
  new Comment(6, 5),
  new Comment(4, 1),
  new Comment(2, null),
  new Comment(7, 6),
  new Comment(1, null),
  new Comment(8, 4),
  new Comment(5, 1),
  new Comment(3, null)
];


const comments2 = [
  new Comment(1, 2),
  new Comment(2, 3),
  new Comment(3, 1)  // forms a cycle: 1 -> 2 -> 3 -> 1
];
const parseCommentsTree = parseCommentsTreeCycle(comments2);
console.log(travere(parseCommentsTree));