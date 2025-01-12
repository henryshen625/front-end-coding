function findNodeById(tree, id) {
    const traversal = (root) => {
        if (root.id === id) {
            return root;
        }
        if (root.children.length === 0) {
            return null;
        }
        for (const child of root.children) {
            const result = traversal(child);
            if (result) {
                return result;
            }
        }
        return null;
    }
    return traversal(tree[0]);
}

const tree = [
    {
      name: "数据1",
      id: 1,
      children: [
        {
          name: "数据2",
          id: 2,
          children: [
            {
              name: "数据3",
              id: 3,
              children:
                {
                  name: "数据4",
                  id: 4,
                  children: [],
                },
            },
              ],
        },
        ],
    }
]
console.log(findNodeById(tree, 3))