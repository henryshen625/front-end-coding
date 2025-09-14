function parseQueryString(url) {
  const queryStart = url.indexOf('?');
  if (queryStart === -1) return {}; // 没有 query string

  const queryString = url.slice(queryStart + 1);
  const pairs = queryString.split('&');

  const result = {};
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    result[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }

  return result;
}


//follow up:
function parseQueryString(url) {
  const queryStart = url.indexOf('?');
  if (queryStart === -1) return {};

  const queryString = url.slice(queryStart + 1).split('#')[0]; // 移除 hash
  const pairs = queryString.split('&');

  const result = {};

  for (const pair of pairs) {
    const [rawKey, rawValue = ''] = pair.split('=');
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue);

    if (key in result) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value]; // 第一次遇到重复 key，转数组
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}