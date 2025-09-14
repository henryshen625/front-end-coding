const fs = require('fs');
const path = require('path');
const crypto = require("crypto");


function getAllFiles(dirPath, allFiles = []) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (let entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            getAllFiles(fullPath, allFiles);
        } else if (entry.isFile()) {
            allFiles.push(fullPath);
        }
    }
    return allFiles;
}

function groupByFileSize(files) {
    const group = new Map();
    for (let file of files) {
        try {
            const size = fs.statSync(file).size;
            if (!group.has(size)) {
                group.set(size, []);
            }
            group.get(size).push(file);
        } catch (error) {
            console.error(`Error reading ${file}:`, err.message);
        }
    }
    return group;
}


function findDupBySize(rootDir) {
    const allFiles = getAllFiles(rootDir);
    const sizeGroup = groupByFileSize(allFiles);
    return Array.from(sizeGroup.values());
}


//part2:

function calculateFileHash(filePath, algorithm = 'sha256') {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath);
        stream.on('error', (err) => {
            reject(err);
        });
        stream.on('data', (chunk) => {
            hash.update(chunk);
        });
         stream.on("end", () => {
            resolve(hash.digest("hex"));
        });
    })
}

async function groupByHash(fileGroups) {
    const hashmap = new Map();
    for (let [size, files] of fileGroups.entries()) {
        if (files.length < 2) {
            continue;
        }
        for (let file of files) {
            const hash = await calculateFileHash(file);
            const key = `${size}:${hash}`;
            if (!hashmap.has(key)) {
                hashmap.set(key, []);
            }
            hashmap.get(key).push(file);
        }
    }
    return hashmap;
}

async function findRealDuplicates(rootDir) {
  const allFiles = getAllFiles(rootDir);
  const sizeGroups = groupByFileSize(allFiles);
  const hashGroups = await groupByHash(sizeGroups);
  return 
}


// part3:
function calculatePartialFileHash(filePath, algorithm = 'sha256', maxBytes = 4096) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath, { start: 0, end: maxBytes - 1 });
        stream .on('error', (err) => {
            reject(err);
        });
        stream.on('data', (chunk) => {
            hash.update(chunk);
        });
         stream.on("end", () => {
            resolve(hash.digest("hex"));
        });
    })
}

async function groupByPartialHash(filegroup, maxBytes = 4096) {
    const partialMap = new Map();
    for (let [size, files] of filegroup.entries()) {
        if (files.length < 2) {
            continue;
        }
        for (let file of files) {
            const partialHash = await calculatePartialFileHash(file, 'sha256', maxBytes);
            const key = `${size}:partial:${partialHash}`;
            if (!partialHash.has(key)) {
                partialMap.set(key, []);
            }
            partialMap.get(key).push(file);
        }
    }
    return partialMap;
} 


async function findRealDuplicates(rootDir) {
  const allFiles = getAllFiles(rootDir);
  const sizeGroups = groupByFileSize(allFiles);
  const hashGroups = await groupByPartialHash(sizeGroups);
  return 
}