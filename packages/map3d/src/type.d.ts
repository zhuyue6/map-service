interface Space {
  width: number,
  height: number,
  depth: number,
}

interface Coordinate {
  x: number
  y: number
  z: number
}

interface Fn {
  (...arg: any[]):  void
}