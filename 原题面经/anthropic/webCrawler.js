async function getUrls() {
    console.log(123);
}

function parseURL(url) {
    const newUrl = new URL(url);
    newUrl.hash = '';
    return newUrl.toString();
}

async function bfs(startUrl) {
    const origin = new URL(startUrl).origin;
    const visited = new Set();
    const result = [];
    const queue = [startUrl];
    visited.add(startUrl);

    while (queue.length > 0) {
        const currentUrl = queue.shift();
        result.push(currentUrl);
        const links = await getUrls(currentUrl);
        for (const link of links) {
            if (!visited.has(link) && new URL(link).origin === origin) {
                visited.add(link);
                queue.push(link);
            }
        }
    }
    return result;
}


async function crawlBFSParallel(startUrl, concurrency) {
    const queue = [startUrl];
    let index = 0;
    const visited = new Set();
    const result = [];
    async function worker() {
        while (true) {
            if (index >= queue.length) {
                break;
            }
            const current = queue[index++];
            result.push(current);
            const links = await getUrls(current);

            for (const link of links) {
                if (!visited.has(link)) {
                    visited.add(link);
                    queue.push(link);
                }
            }
        }
    }
    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
    return result;
}

