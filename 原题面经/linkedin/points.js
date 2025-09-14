// 你的数据点
const points = [
  {x: 1, y: 1},
  {x: 2, y: 2},
  {x: 5, y: 5},
  {x: 6, y: 6},
  {x: 8, y: 8},
  {x: 15, y: 15}
];


function pointsWithinDistance(points, center, d) {
  const res = [];
  const d2 = d * d; // 避免开方
  for (const p of points) {
    const dx = p.x - center.x;
    const dy = p.y - center.y;
    if (dx*dx + dy*dy <= d2) res.push(p);
  }
  return res;
}


function buildGrid(points, cellSize) {
  const grid = new Map();
  for (const p of points) {
    const cx = Math.floor(p.x / cellSize);
    const cy = Math.floor(p.y / cellSize);
    const key = `${cx},${cy}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(p);
  }
  return grid;
}

function query(grid, center, d, cellSize) {
  const cx = Math.floor(center.x / cellSize);
  const cy = Math.floor(center.y / cellSize);
  const d2 = d*d;
  const res = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${cx+dx},${cy+dy}`;
      const cell = grid.get(key);
      if (!cell) continue;
      for (const p of cell) {
        const dx2 = p.x - center.x;
        const dy2 = p.y - center.y;
        if (dx2*dx2 + dy2*dy2 <= d2) res.push(p);
      }
    }
  }
  return res;
}


const grid = buildGrid(points, 3);
console.log(query(grid, {x:5, y:5}, 2, 3));

console.log(query(grid, {x:0, y:0}, 2.5, 3));
// 预期: [{x:1,y:1},{x:2,y:2}]

console.log(query(grid, {x:7, y:7}, 3, 3));
// 预期: [{x:5,y:5},{x:6,y:6},{x:8,y:8}]

console.log(query(grid, {x:0, y:10}, 2, 3));
// 预期: []

console.log(query(grid, {x:15, y:15}, 1, 3));
