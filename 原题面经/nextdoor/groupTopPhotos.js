/*
feed objects, 3 types: NORMAL, PHOTO, VIDEO with scores, and 
group first 3 PHOTO items. 
先要按照score对feed object进行排序，然后scan，group前面三个PHOTO.
*/

function groupTopPhotos(feed) {
  // 1. 按 score 降序排序
  const sorted = [...feed].sort((a, b) => b.score - a.score);

  // 2. 找出前 3 个 PHOTO 的索引
  const photoIndexes = [];
  for (let i = 0; i < sorted.length && photoIndexes.length < 3; i++) {
    if (sorted[i].type === 'PHOTO') {
      photoIndexes.push(i);
    }
  }

  if (photoIndexes.length < 3) {
    return sorted; // 不足 3 个，不做 group
  }

  // 3. 构建 group
  const groupItems = photoIndexes.map(i => sorted[i]);
  const group = {
    type: "PHOTO_GROUP",
    items: groupItems,
    score: Math.max(...groupItems.map(item => item.score))  // 👈 新增
  };

  // 4. 剔除 groupItems
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (photoIndexes.includes(i)) continue;
    result.push(sorted[i]);
  }

  // 5. 插入 group
  result.splice(Math.min(...photoIndexes), 0, group);

  return result;
}


// follow up 1: 只要是photo 都group 也就是说尾部不一定是3个组成的group
function groupAllPhotos(feed) {
  // Step 1: sort all feed by score descending
  const sorted = [...feed].sort((a, b) => b.score - a.score);

  const photoBuffer = [];
  const resultItems = [];

  for (const item of sorted) {
    if (item.type === 'PHOTO') {
      photoBuffer.push(item);
      if (photoBuffer.length === 3) {
        resultItems.push(createGroup(photoBuffer));
        photoBuffer.length = 0;
      }
    } else {
      resultItems.push(item); // Keep NORMAL or VIDEO
    }
  }

  // Step 2: Add remaining PHOTO items (<3) into a final group
  if (photoBuffer.length > 0) {
    resultItems.push(createGroup(photoBuffer));
  }

  // Step 3: Sort all items (PHOTO_GROUP, NORMAL, VIDEO) by score descending
  resultItems.sort((a, b) => b.score - a.score);
  return resultItems;
}

function createGroup(photoItems) {
  return {
    type: 'PHOTO_GROUP',
    items: [...photoItems],
    score: Math.max(...photoItems.map(i => i.score))
  };
}


const feed = [
  { type: "PHOTO", score: 90 },
  { type: "PHOTO", score: 80 },
  { type: "VIDEO", score: 75 },
  { type: "PHOTO", score: 60 },
  { type: "NORMAL", score: 65 },
  { type: "PHOTO", score: 30 }
];


function createPhotoGroup(items) {
    return {
        type: 'PhotoGroup',
        items: items,
        score: Math.max(...items.map(item => item.score))
    }
}


function sortFeedObject(feeds) {
    if (feeds.legth === 0) {
        return feeds;
    }
    const result = [];
    let photoGroup = [];

    for (const feed of feeds) {
        if (feed.type === 'PHOTO') {
            photoGroup.push(feed);
            if (photoGroup.length === 3) {
                result.push(createPhotoGroup(photoGroup));
                photoGroup = [];
            }
        } else {
            result.push(feed);
        }
    }
    if (photoGroup.length > 0) {
        result.push(createPhotoGroup(photoGroup));
    }

    result.sort((a, b) => b.score - a.score);
    return result;
}

console.log(sortFeedObject(feed));