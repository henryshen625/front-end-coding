function deepClone(object) {
    if (!object || typeof object !== 'object') return;
    let newObject = Array.isArray(object) ? [] : {};

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            newObject[key] = typeof object[key] === 'object' ? deepClone(object[key]) : object[key];
    
        }
    }
    return newObject;
}