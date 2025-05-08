export function isDef(data: any) {
  return data !== undefined && data !== null
}

export function isUnDef(data: any) {
  return data === undefined || data === null
}

export type isCompatible<T, P> = T extends P ? true : false
