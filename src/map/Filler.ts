import { trampoline } from "./utils";
function random(max: number) {
  return Math.round(Math.random() * max);
}

export class Filler {
  value: number;
  name: string;
  xCount: number;
  yCount: number;
  frontierCount: number;
  frontiers: {
    [prop: string]: boolean;
  };
  color: string;
  constructor(value: number, name: string, xCount: number, yCount: number) {
    this.value = value;
    this.name = name;
    this.xCount = xCount;
    this.yCount = yCount;
    this.frontierCount = 0;
    this.frontiers = {};
    this.color = "white";
  }
  // 相邻的
  _getContiguous(frontier: PointType) {
    return [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].map((dir) => ({
      x: frontier.x + dir[0],
      y: frontier.y + dir[1],
    }));
  }
  // 斜角的
  _getSkewContiguous(frontier: PointType) {
    return [
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, -1],
    ].map((dir) => ({
      x: frontier.x + dir[0],
      y: frontier.y + dir[1],
    }));
  }

  changeMapItem(dataMap: DataMapType, x: number, y: number) {
    const mapItem = dataMap[x][y];
    if (mapItem) {
      mapItem.value = this.value;
      mapItem.color = this.color;
    }
  }

  getMapInfo() {
    const keys = Object.keys(this.frontiers);
    const x: number[] = [],
      y: number[] = [];
    keys.forEach((ele) => {
      const xy = ele.split(":");
      x.push(parseInt(xy[0]));
      y.push(parseInt(xy[1]));
    });
    return { x, y };
  }

  getCenterMap() {
    const info = this.getMapInfo();

    const sumX = info.x.reduce((pre, current) => {
      return pre + current;
    }, 0);
    const sumY = info.y.reduce((pre, current) => {
      return pre + current;
    }, 0);

    return {
      x: Math.floor(sumX / info.x.length),
      y: Math.floor(sumY / info.y.length),
    };
  }

  getSpaceMapEdge(dataMap: DataMapType) {
    const center = this.getCenterMap();
    const oneDir = this._getContiguous(center)[random(3)];
    let point = oneDir;
    let count = 0;
    while (count < this.xCount) {
      count++;
      if (dataMap[point.x][point.y] && dataMap[point.x][point.y].value === -1) {
        return point;
      } else {
        point = this._getContiguous(point)[random(3)];
      }
    }

    return { x: -1, y: -1 };
  }

  filterCanUse(dataMap: DataMapType, coors: { x: number; y: number }[]) {
    return coors.filter((coor) => {
      if (
        coor.x < 0 ||
        coor.y < 0 ||
        coor.x >= this.xCount ||
        coor.y >= this.yCount
      )
        return false;
      if (dataMap[coor.x][coor.y] && dataMap[coor.x][coor.y].value !== -1)
        return false;
      return true;
    });
  }

  fill(dataMap: DataMapType, start: PointType) {
    let _loopCount = 0;
    const func = ( start: PointType): any => {
      // 保证循环次数最多整个网格的数量的一半
      if (_loopCount >= this.xCount * this.yCount * 1.5) {
        console.log("超出查询最大的次数");
        return;
      }
      
      _loopCount++;
      if (
        start.x > 0 &&
        start.y > 0 &&
        dataMap[start.x] &&
        dataMap[start.x][start.y] &&
        dataMap[start.x][start.y].value === -1
      ) {
        this.frontierCount++;
        this.frontiers[`${start.x}:${start.y}`] = true;
        this.changeMapItem(dataMap, start.x, start.y);
      }

      let newCoors = this._getContiguous({
        x: start.x,
        y: start.y,
      });

      let canUseCoors = this.filterCanUse(dataMap, newCoors);

      if (canUseCoors.length === 0) {
        // 极端情况处理
        // 找斜对角
        const skewCoors = this._getSkewContiguous(start);
        const skewCanUse = this.filterCanUse(dataMap, skewCoors);
        if (skewCanUse.length === 0 && this.frontierCount <= 1) {
          // 相当于一个点的前后左右，斜对面全部被占满了,则尽量从前后左右再次突围
          return func.bind(this, newCoors[random(3)]);
        } else {
          newCoors = skewCoors;
          canUseCoors = skewCanUse;
        }
      }

      for (let j = 0; j < canUseCoors.length; j++) {
        const ele = canUseCoors[j];
        this.changeMapItem(dataMap, ele.x, ele.y);
        this.frontiers[`${ele.x}:${ele.y}`] = true;
        this.frontierCount++;
      }

      if (this.frontierCount < this.value) {
        const frontLen = Object.keys(this.frontiers).length;
        let randIdx = random(this.frontierCount - 1);
        if (randIdx !== -1 && frontLen > 0) {
          // 某个点附近有空白的地方
          const frontier = Object.keys(this.frontiers)
            [randIdx].split(":")
            .map((n) => parseInt(n));
          return func.bind(this, { x: frontier[0], y: frontier[1] });
        } else if (Object.keys(this.frontiers).length > 0) {
          // 再找已经标记的点附近
          const frontier = Object.keys(this.frontiers)
            [random(Object.keys(this.frontiers).length)].split(":")
            .map((n) => parseInt(n));
          return func.bind(this, { x: frontier[0], y: frontier[1] });
        } else {
          // 随机一个方向依次再找

          const coors = newCoors;
          const index = random(coors.length - 1);
          const frontier = coors[index];
          if (frontier && coors.length > 1) {
            return func.bind(this, { x: frontier.x, y: frontier.y });
          }
        }
      }
    };

    trampoline(func( start));
  }
}
