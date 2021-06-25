import React, { Component } from "react";
import { Point, MapItem } from "./Map";
import { InnerFiller as Filler } from "./InnerFill";
import { addAuxiliaryLine, getEventPosition } from "./utils";

const getRandomColor = function () {
  var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
  while (hex.length < 6) {
    //while循环判断hex位数，少于6位前面加0凑够6位
    hex = "0" + hex;
  }
  return "#" + hex; //返回‘#’开头16进制颜色
};

export type DetailMapProps = Partial<MapItemInfoType> &
  Partial<{
    showType: "parent" | "average" | "average-vertical" | "random-fill";
    showLine: boolean;
  }> & {
    datas: ItemMapData[];
  } & Partial<BaseProps>;

let ItemGridSize = 10;

export default class DetailMap extends Component<DetailMapProps> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  numXs: number;
  numYs: number;
  dataMap: DataMapType;
  ctx: CanvasRenderingContext2D | null;
  labelQueue: MapItemInfoType[];

  constructor(props: DetailMapProps) {
    super(props);
    this.canvasRef = React.createRef();
    this.ctx = null;
    this.numXs = 0;
    this.numYs = 0;
    this.dataMap = [];
    this.labelQueue = [];
  }

  drawGridTile(x: number, y: number, color?: string) {
    const xPos = x * ItemGridSize;
    const yPos = y * ItemGridSize;
    if (this.ctx) {
      this.ctx.fillStyle = color || "transparent";
      this.ctx.fillRect(xPos, yPos, ItemGridSize, ItemGridSize);
    }
  }

  clearGrid() {
    for (let x = 0; x < this.numXs; x++) {
      for (let y = 0; y < this.numYs; y++) {
        const xPos = x * ItemGridSize;
        const yPos = y * ItemGridSize;
        this.ctx && this.ctx.clearRect(xPos, yPos, ItemGridSize, ItemGridSize);
      }
    }
    if (this.props.showLine && this.ctx) {
      addAuxiliaryLine(this.ctx, ItemGridSize);
    }
  }
  clearMap() {
    for (let x = 0; x < this.numXs; x++) {
      for (let y = 0; y < this.numYs; y++) {
        this.dataMap[x][y].value = -1;
      }
    }
  }

  draw = () => {
    // 绘制网格
    for (let x = 0; x < this.numXs; x++) {
      for (let y = 0; y < this.numYs; y++) {
        const mapItem = this.dataMap[x][y];
        if (mapItem && mapItem.value !== -1) {
          this.drawGridTile(x, y, mapItem.color);
        }
      }
    }
    // 绘制文字
    for (let i = 0; i < this.labelQueue.length; i++) {
      const item = this.labelQueue[i];
      this.drawLabel(item);
    }
  };

  drawLabel = (info: MapItemInfoType) => {
    const { center, name, color } = info;
    if (this.ctx) {
      this.ctx.fillStyle = color || "black";
      this.ctx.font = "20px bold";
    }

    // @ts-ignore
    this.ctx.fillTextVertical(
      name,
      center.x * ItemGridSize,
      center.y * ItemGridSize
    );
  };

  initDataMap = () => {
    if (this.ctx) {
      const ctx = this.ctx;
      const { positions = {}, color = "transparent" } = this.props;
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      var xLineTotals = Math.floor(canvasHeight / ItemGridSize); // 计算需要绘画的x轴条数
      var yLineTotals = Math.floor(canvasWidth / ItemGridSize); // 计算需要绘画y轴的条数
      this.numYs = xLineTotals;
      this.numXs = yLineTotals;

      // 构建数据二维地图
      for (let i = 0; i < this.numXs; i++) {
        const tmp: {
          value: number;
          name: string;
          color?: string;
        }[] = [];
        for (let j = 0; j < this.numYs; j++) {
          if (positions[`${i}:${j}`]) {
            tmp.push({ color, value: 1, name: "" });
          }
          tmp.push({ color: "transparent", value: -1, name: "" });
        }
        this.dataMap.push(tmp);
      }
    }
  };

  componentWillUpdate(newProps: DetailMapProps) {
    if (
      newProps.positions !== this.props.positions ||
      newProps.color !== this.props.color
    ) {
      ItemGridSize = newProps.gridSize || 10;

      this.updateMap(newProps);
      this.clearGrid();
      this.draw();
    }
  }

  updateMap(props: DetailMapProps) {
    // 将地图移动到中心
    if (props.center && props.positions) {
      const mapCenterX = Math.floor(this.numXs / 2);
      const mapCenterY = Math.floor(this.numYs / 2);
      const xOp = mapCenterX - props.center.x;
      const yOp = mapCenterY - props.center.y;
      // 更新前先清除一波
      this.clearMap();
      // 复制之前父地图到自地图中
      for (let i = 0; i < this.numXs; i++) {
        for (let j = 0; j < this.numYs; j++) {
          if (props.positions[`${i}:${j}`]) {
            this.dataMap[i + xOp][j + yOp].value = 0;
            this.dataMap[i + xOp][j + yOp].color = props.color;
          }
        }
      }
    }
    const { showType, mapColorRandom } = props;
    if (
      showType === "average" ||
      showType === "random-fill" ||
      showType === "average-vertical"
    ) {
      // 开始填充
      (props.datas || []).forEach((ele, index) => {
        const filler = new Filler(ele.value, ele.name, this.numXs, this.numYs);
        // 同帮会不同的主播颜色近似
        filler.color = mapColorRandom ? getRandomColor() : ele.color || "";
        // 子地图和父地图生成方向不一样
        // 平局分配
        if (showType === "average" || showType === "average-vertical") {
          filler.fillWithRow(this.dataMap, showType);
        } else if (props.showType === "random-fill") {
          // 随机分配
          if (index === props.datas.length - 1) {
            filler.fillReaming(this.dataMap);
          } else {
            filler.fill(
              this.dataMap,
              new Point(Math.floor(this.numXs / 2), Math.floor(this.numYs / 2))
            );
          }
        }
      });
    }
  }

  getEventInWhereMap(position: PointType) {
    for (let i = 0; i < this.labelQueue.length; i++) {
      const ele = this.labelQueue[i];
      if (ele.positions[`${position.x}:${position.y}`]) {
        return ele.id;
      }
    }

    return "";
  }

  registerListener = () => {
    this.canvasRef.current?.addEventListener("click", (event) => {
      const p = getEventPosition(event);
      // 转换为数据地图中的坐标
      const mapPosition = {
        x: Math.floor(p.x / ItemGridSize),
        y: Math.floor(p.y / ItemGridSize),
      };
    });
  };
  componentDidMount() {
    const canvas = this.canvasRef.current;
    const { showLine, gridSize = 10 } = this.props;
    const ctx = canvas?.getContext("2d");
    ItemGridSize = gridSize;
    if (ctx) {
      this.ctx = ctx;
      this.initDataMap();
      this.registerListener();
      if (showLine) {
        addAuxiliaryLine(ctx, ItemGridSize);
      }
    }
  }
  render() {
    const { mapWidth = 1000, mapHeight = 500 } = this.props;
    return <canvas ref={this.canvasRef} width={mapWidth} height={mapHeight} />;
  }
}
