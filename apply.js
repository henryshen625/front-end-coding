Function.prototype.myApply = function (ctx, args) {
    ctx = ctx === null || ctx === undefined ? globalThis : Object(ctx);
    const key = Symbol();
    Object.defineProperty(ctx, key, {
        value: this,
        enumerable: false
    });
    const r = ctx[key](...args);
    delete ctx[key];
    return r;
}