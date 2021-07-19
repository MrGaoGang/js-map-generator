import React, { Component } from "react";
import { addAuxiliaryLine, getEventPosition, getRandomColor } from "./utils";

let ItemGridSize = 10;

type BasePropsLife = {
  callback?: (info: MapItemInfoType) => void;
};

export default class BaseMap<T> extends Component<
  T & Partial<BaseProps> & BasePropsLife
> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  numXs: number;
  numYs: number;
  dataMap: DataMapType;
  ctx: CanvasRenderingContext2D | null;
  labelQueue: MapItemInfoType[];

  constructor(props: T & Partial<BaseProps> & BasePropsLife) {
    super(props);
    this.canvasRef = React.createRef();
    this.numXs = 0;
    this.numYs = 0;
    this.dataMap = [];
    this.ctx = null;
    this.labelQueue = [];
    ItemGridSize = props.gridSize || 10;
  }

  doRender() {
    return <div>please rewrite do render!</div>;
  }
  doDidMounted() {}

  drawGridTile(x: number, y: number, color?: string) {
    const xPos = x * ItemGridSize;
    const yPos = y * ItemGridSize;
    if (this.ctx) {
      this.ctx.fillStyle = color || "transparent";
      // this.ctx.lineWidth = 0.5;
      this.ctx.clearRect(xPos, yPos, ItemGridSize, ItemGridSize);
      this.ctx.fillRect(xPos, yPos, ItemGridSize, ItemGridSize);
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

    if (this.props.showLabel) {
      for (let i = 0; i < this.labelQueue.length; i++) {
        const item = this.labelQueue[i];
        this.drawLabel(item);
      }
    }
  };

  drawLabel = (info: MapItemInfoType) => {
    const { center, name, textColor } = info;

    const { label } = this.props;
    if (this.ctx) {
      if (label) {
        this.ctx.fillStyle = textColor || "black";
        this.ctx.font = `${label.fontSize} ${label.fontFamily} ${label.fontWeight}`;
      } else {
        this.ctx.fillStyle = textColor || "black";
        this.ctx.font = "14px bold";
      }
    }
    if (label?.labelDirection === "verticel") {
      // @ts-ignore
      this.ctx.fillTextVertical(
        name,
        center.x * ItemGridSize,
        center.y * ItemGridSize
      );
    } else {
      // @ts-ignore
      this.ctx.fillText(name, center.x * ItemGridSize, center.y * ItemGridSize);
    }
  };

  initDataMap = (ctx: CanvasRenderingContext2D) => {
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
        tmp.push({ color: "white", value: -1, name: "" });
      }
      this.dataMap.push(tmp);
    }
  };

  getEventInWhereMap(p: PointType) {
    // 转换为数据地图中的坐标
    const position = {
      x: Math.floor(p.x / ItemGridSize),
      y: Math.floor(p.y / ItemGridSize),
    };    
    for (let i = 0; i < this.labelQueue.length; i++) {
      const ele = this.labelQueue[i];
      if (ele.positions[`${position.x}:${position.y}`]) {
        return { id: ele.id, index: i };
      }
    }

    return {
      index: -1,
      id: "",
    };
  }

  registerListener = () => {
    this.canvasRef.current?.addEventListener("click", (event) => {
      const p = getEventPosition(event);
      const selectMap = this.getEventInWhereMap(p);
      if (selectMap.index !== -1) {
        const info = this.labelQueue[selectMap.index];
        this.props.callback && this.props.callback(info);
      }
    });
  };
  componentDidMount() {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    this.ctx = ctx;
    this.doDidMounted();
  }
  render() {
    return this.doRender();
  }
}
