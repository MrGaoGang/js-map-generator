import React, { Component } from "react";
import { Point, MapItem } from "./Map";
import { Filler } from "./Filler";
import "./polyfill";
import { addAuxiliaryLine, getEventPosition } from "./utils";
const getRandomColor = function () {
  var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
  while (hex.length < 6) {
    //while循环判断hex位数，少于6位前面加0凑够6位
    hex = "0" + hex;
  }
  return "#" + hex; //返回‘#’开头16进制颜色
};

type MainMapProps = {
  mapData: ItemMapData[];
  callback?: (info: MapItemInfoType) => void;
} & Partial<BaseProps>;

type MainMapState = {
  selectMapInfo: Partial<MapItemInfoType>;
};
let ItemGridSize = 10;
export default class MainMap extends Component<MainMapProps, MainMapState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  numXs: number;
  numYs: number;
  dataMap: DataMapType;
  ctx: CanvasRenderingContext2D | null;
  labelQueue: MapItemInfoType[];

  constructor(props: MainMapProps) {
    super(props);
    this.canvasRef = React.createRef();
    this.numXs = 0;
    this.numYs = 0;
    this.dataMap = [];
    this.ctx = null;
    this.labelQueue = [];
    this.state = {
      selectMapInfo: {},
    };
  }

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

    for (let i = 0; i < this.labelQueue.length; i++) {
      const item = this.labelQueue[i];
      this.drawLabel(item);
    }
  };

  drawLabel = (info: MapItemInfoType) => {
    const { center, name, textColor } = info;

    if (this.ctx) {
      this.ctx.fillStyle = textColor || "black";
      this.ctx.font = "20px bold";
    }
    // @ts-ignore
    this.ctx.fillTextVertical(
      name,
      center.x * ItemGridSize,
      center.y * ItemGridSize
    );
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

  changeMapItem(x: number, y: number) {
    const mapItem = this.dataMap[x][y];
    if (mapItem) {
      mapItem.value = 1;
      mapItem.color = "red";
    }
  }

  getEventInWhereMap(position: PointType) {
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
      // 转换为数据地图中的坐标
      const mapPosition = {
        x: Math.floor(p.x / ItemGridSize),
        y: Math.floor(p.y / ItemGridSize),
      };

      const selectMap = this.getEventInWhereMap(mapPosition);
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
    if (this.ctx) {
      const { mapColorRandom, gridSize } = this.props;
      ItemGridSize = gridSize || 10;

      this.initDataMap(this.ctx);
      this.registerListener();
      addAuxiliaryLine(this.ctx, ItemGridSize);
      if (this.props.mapData) {
        this.props.mapData.forEach((ele, index) => {
          let lastSpace = null;

          const filler = new Filler(
            ele.value,
            ele.name,
            this.numXs,
            this.numYs
          );
          // 同帮会不同的主播颜色近似
          filler.color = mapColorRandom ? getRandomColor() : ele.color || "";

          filler.fill(
            this.dataMap,
            lastSpace ||
              new Point(Math.floor(this.numXs / 2), Math.floor(this.numYs / 2))
          );
          this.labelQueue.push({
            center: filler.getCenterMap(),
            name: filler.name,
            id: filler.name, // 后面换成真实的id
            color: filler.color,
            positions: filler.frontiers,
            textColor: getRandomColor(),
            index: index,
            children: ele.children || [],
          });
        });
      }

      this.draw();
    }
  }
  render() {
    const { mapWidth = 1000, mapHeight = 500 } = this.props;
    return <canvas ref={this.canvasRef} width={mapWidth} height={mapHeight} />;
  }
}
