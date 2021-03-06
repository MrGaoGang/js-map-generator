import React from "react";
import { Point } from "./Map";
import { Filler } from "./Filler";
import "./polyfill";
import { addAuxiliaryLine, getRandomColor, getSpaceCenter } from "./utils";

import BaseMap from "./BaseMap";

type MainMapProps = {
  mapData: ItemMapData[];
  callback?: (info: MapItemInfoType) => void;
} & Partial<BaseProps>;

let ItemGridSize = 10;
export default class MainMap extends BaseMap<MainMapProps> {
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
  }

  doDidMounted() {
    if (this.ctx) {
      const { mapColorRandom, gridSize, showLine, lifeCycle } = this.props;
      ItemGridSize = gridSize || 10;

      this.initDataMap(this.ctx);
      this.registerListener();
      if (showLine) {
        addAuxiliaryLine(this.ctx, ItemGridSize);
      }
      if (this.props.mapData) {
        this.labelQueue = [];
        setTimeout(() => {
          lifeCycle && lifeCycle.beforeMounted && lifeCycle.beforeMounted();
        });
        this.props.mapData.forEach((ele, index) => {
          let lastSpace: PointType | null = null;

          const filler = new Filler(
            ele.value,
            ele.name,
            this.numXs,
            this.numYs
          );
          // 同帮会不同的主播颜色近似
          filler.color = mapColorRandom ? getRandomColor() : ele.color || "";
          const center = new Point(
            Math.floor(this.numXs / 2),
            Math.floor(this.numYs / 2)
          );
          if (ele.direction !== undefined) { // 针对有方向的
            lastSpace = getSpaceCenter(this.dataMap, ele.direction);            
            lastSpace = lastSpace.x !== -1 ? lastSpace : center;
          }
          filler.fill(
            this.dataMap,
            lastSpace && lastSpace.x !== -1 ? lastSpace : center
          );

          this.labelQueue.push({
            center: filler.getCenterMap(),
            name: filler.name,
            id: ele.id || ele.name, // 后面换成真实的id
            color: filler.color,
            positions: filler.frontiers,
            index: index,
            textColor: ele.textColor || "",
            datas: ele.children || [],
          });
        });
      }

      this.draw();
      setTimeout(() => {
        lifeCycle && lifeCycle.mounted && lifeCycle.mounted(this.labelQueue);
      });
    }
  }
  doRender() {
    const { mapWidth = 1000, mapHeight = 500 } = this.props;
    return (
      <canvas
        ref={this.canvasRef}
        width={mapWidth}
        height={mapHeight}
        style={{
          width: mapWidth + "px",
          height: mapHeight + "px",
        }}
      />
    );
  }
}
