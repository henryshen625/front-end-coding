/*
模擬 database, 實現以下幾個命令: set(k, v), get(k), unset(k), numWithValue(k)。numWithValue(k) 
會問時間複雜度, 然後要求達到O(1)
*/

class SimpleDatabase {
  constructor() {
    this.keyToValue = new Map();
    this.valueCount = new Map();
  }

  set(key, value) {
    if (this.keyToValue.has(key)) {
      const oldValue = this.keyToValue.get(key);
      this._decrementCount(oldValue);
    }

    this.keyToValue.set(key, value);
    this._incrementCount(value);
  }

  get(key) {
    return this.keyToValue.has(key) ? this.keyToValue.get(key) : null;
  }

  unset(key) {
    if (this.keyToValue.has(key)) {
      const value = this.keyToValue.get(key);
      this._decrementCount(value);
      this.keyToValue.delete(key);
    }
  }

  numWithValue(value) {
    return this.valueCount.get(value) || 0;
  }

  _incrementCount(value) {
    this.valueCount.set(value, (this.valueCount.get(value) || 0) + 1);
  }

  _decrementCount(value) {
    const count = this.valueCount.get(value);
    if (count === 1) {
      this.valueCount.delete(value);
    } else {
      this.valueCount.set(value, count - 1);
    }
  }
}


// follow up 1: 在之前基礎上多加兩個命令 begin(), rollback(), 調用 rollback() 後如遇到 get(k) 則需返回 begin() 調用之前的結果
class SimpleDatabase {
  constructor() {
    this.keyToValue = new Map();
    this.valueCount = new Map();

    this.backup = null;       // 保存事务开始时的快照
    this.inTransaction = false;
  }

  set(key, value) {
    if (this.inTransaction && !this.backup) {
      this._saveSnapshot();
    }

    if (this.keyToValue.has(key)) {
      const oldValue = this.keyToValue.get(key);
      this._decrementCount(oldValue);
    }

    this.keyToValue.set(key, value);
    this._incrementCount(value);
  }

  get(key) {
    return this.keyToValue.has(key) ? this.keyToValue.get(key) : null;
  }

  unset(key) {
    if (this.inTransaction && !this.backup) {
      this._saveSnapshot();
    }

    if (this.keyToValue.has(key)) {
      const value = this.keyToValue.get(key);
      this._decrementCount(value);
      this.keyToValue.delete(key);
    }
  }

  numWithValue(value) {
    return this.valueCount.get(value) || 0;
  }

  begin() {
    if (!this.inTransaction) {
      this.inTransaction = true;
      this._saveSnapshot();
    }
  }

  rollback() {
    if (!this.inTransaction || !this.backup) {
      console.log("NO TRANSACTION");
      return;
    }

    // 恢复 snapshot
    this.keyToValue = this._cloneMap(this.backup.keyToValue);
    this.valueCount = this._cloneMap(this.backup.valueCount);

    this.backup = null;
    this.inTransaction = false;
  }

  _saveSnapshot() {
    this.backup = {
      keyToValue: this._cloneMap(this.keyToValue),
      valueCount: this._cloneMap(this.valueCount),
    };
  }

  _incrementCount(value) {
    this.valueCount.set(value, (this.valueCount.get(value) || 0) + 1);
  }

  _decrementCount(value) {
    const count = this.valueCount.get(value);
    if (count === 1) {
      this.valueCount.delete(value);
    } else {
      this.valueCount.set(value, count - 1);
    }
  }

  _cloneMap(original) {
    return new Map(original);
  }
}

// follow up: commit?