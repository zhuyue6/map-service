export function simpleDeepCopy(data: object) {
  return JSON.parse(JSON.stringify(data))
}

export function deepCopy(target: any, hash = new WeakMap()) {
  // 处理原始类型（number/string/boolean/null/undefined/Symbol）
  if (target === null || typeof target !== 'object') {
      return target;
  }

  // 处理日期对象
  if (target instanceof Date) {
      return new Date(target);
  }

  // 处理正则对象
  if (target instanceof RegExp) {
      return new RegExp(target);
  }

  // 处理循环引用（关键：用WeakMap记录已拷贝对象）
  if (hash.has(target)) {
      return hash.get(target);
  }

  // 处理数组和普通对象（获取构造函数，兼容自定义对象）
  const cloneTarget = new target.constructor();

  // 记录已处理对象（避免循环引用）
  hash.set(target, cloneTarget);

  // 递归拷贝对象属性（处理数组和对象）
  if (Array.isArray(target)) {
      target.forEach((item, index) => {
          cloneTarget[index] = deepCopy(item, hash);
      });
  } else {
      // 处理对象自身可枚举属性（忽略原型链属性）
      Object.keys(target).forEach(key => {
          cloneTarget[key] = deepCopy(target[key], hash);
      });
  }

  return cloneTarget;
}


export function isDef<T>(data: T | undefined | null): data is T {
  return data !== undefined && data !== null
}
  
export function isUnDef(data: any): data is undefined | null {
  return data === undefined || data === null
}