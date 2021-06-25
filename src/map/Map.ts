/**
 * 每个基础网格的信息
 * @param {*} value
 * @param {*} color
 */
export class MapItem {
  value: number;
  color: string;
  constructor(value: number, color: string) {
    this.value = value;
    this.color = color;
  }
}

// 每个网格的像素
export const ItemGridSize = 10;

// 每个网格代表的权重
export const ItemGridValue = 10;

// 每一个点
export class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export function getGridCount(value: number) {
  return Math.floor(value / ItemGridValue);
}


