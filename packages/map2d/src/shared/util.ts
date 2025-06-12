export function isDef(data: any) {
  return data !== undefined && data !== null
}

export function isUnDef(data: any) {
  return data === undefined || data === null
}

export type isCompatible<T, P> = T extends P ? true : false


let safeStyleSheet: null | CSSStyleSheet  = null;
export function safeInsertCssRule(cssRule: string) {
  if (!safeStyleSheet) {
    // 使用示例
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    safeStyleSheet = styleElement.sheet;
  }
  safeStyleSheet!.insertRule(cssRule)
}