import { Filler } from "./Filler";
import { trampoline } from "./utils";
function random(max: number) {
  return Math.round(Math.random() * max);
}

export class InnerFiller extends Filler {
  constructor(value: number, name: string, xCount: number, yCount: number) {
    super(value, name, xCount, yCount);
  }

  // 一般是最后一个进行填充剩余的,但是使用此种方式找中心点还存在一定的问题，需要找到最大的连续部分
  fillReaming(dataMap: DataMapType) {
    for (let x = 0; x < this.xCount; x++) {
      for (let y = 0; y < this.yCount; y++) {
        if (dataMap[x][y].value === 0) {
          this.frontiers[`${x}:${y}`] = true;
          this.changeMapItem(dataMap, x, y);
        }
      }
    }
  }

  fillWithRow(dataMap: DataMapType, showType: "average" | "average-vertical") {
    let count = 0;
    if (showType === "average") {
      for (let y = 0; y < this.yCount; y++) {
        for (let x = 0; x < this.xCount; x++) {
          if (dataMap[x][y].value === 0 && count <= this.value) {
            this.frontiers[`${x}:${y}`] = true;
            this.changeMapItem(dataMap, x, y);
            count++;
          }
        }
      }
    } else {
      for (let x = 0; x < this.xCount; x++) {
        for (let y = 0; y < this.yCount; y++) {
          if (dataMap[x][y].value === 0 && count <= this.value) {
            this.frontiers[`${x}:${y}`] = true;
            this.changeMapItem(dataMap, x, y);
            count++;
          }
        }
      }
    }
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
      // 如果不存在地图上则不适用,或者已经标记过了的
      if (
        dataMap[coor.x][coor.y] &&
        (dataMap[coor.x][coor.y].value === -1 ||
          dataMap[coor.x][coor.y].value > 0)
      )
        return false;
      return true;
    });
  }

  fill(dataMap: DataMapType, start: PointType) {
    // 保证循环次数最多整个网格的数量的一半
    let _loopCount = 0;
    const func = (start: PointType): any => {
      if (_loopCount >= this.xCount * this.yCount * 1.5) {
        console.log("inner超出查询最大的次数");
        return;
      }
      _loopCount++;

      // 填充已存在的
      if (
        start.x > 0 &&
        start.y > 0 &&
        dataMap[start.x] &&
        dataMap[start.x][start.y] &&
        dataMap[start.x][start.y].value === 0
      ) {
        this.frontiers[`${start.x}:${start.y}`] = true;
        this.changeMapItem(dataMap, start.x, start.y);
        this.frontierCount++;
      }

      let newCoors = this._getContiguous({
        x: start.x,
        y: start.y,
      });

      let canUseCoors = this.filterCanUse(dataMap, newCoors);

      if (canUseCoors.length === 0) {
        const skewCoors = this._getSkewContiguous(start);
        const skewCanUse = this.filterCanUse(dataMap, skewCoors);
        if (skewCanUse.length === 0) {
          // 相当于一个点的前后左右，斜对面全部被占满了,则尽量从前后左右再次突出
          return func.bind(this, newCoors[random(3)]);
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

        let randIdx = random(frontLen - 1);
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
          const coors = this._getContiguous(start);
          const index = random(coors.length - 1);
          const frontier = coors[index];

          // 一定要保证随机的左右是有值的
          if (frontier && coors.length > 1) {
            return func.bind(this, { x: frontier.x, y: frontier.y });
          }
        }
      }
    };

    trampoline(func(start))
  }
}
