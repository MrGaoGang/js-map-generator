import React, { Component } from "react";
import { Point, MapItem } from "./Map";
import { InnerFiller as Filler } from "./InnerFill";
import { addAuxiliaryLine, getEventPosition } from "./utils";
import BaseMap from "./BaseMap";

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
    callback?: (info: MapItemInfoType) => void;
  }> & {
    datas: ItemMapData[];
  } & Partial<BaseProps>;

let ItemGridSize = 10;

export default class DetailMap extends BaseMap<DetailMapProps> {
  constructor(props: DetailMapProps) {
    super(props);
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

  componentWillUpdate(newProps: DetailMapProps) {
    
    if (newProps !== this.props) {
      this.renderGrid(newProps);
    }
  }

  renderGrid(newProps:DetailMapProps){
    ItemGridSize = newProps.gridSize || 10;
    this.updateMap(newProps);
    this.clearGrid();
    this.draw();
  }

  updateMap(props: DetailMapProps) {
    // 将地图移动到中心
    if (props.center && props.positions) {
      const mapCenterX = Math.floor(this.numXs / 2);
      const mapCenterY = Math.floor(this.numYs / 2);
      const { center, color } = props;
      const xC = center.x - mapCenterX;
      const yC = center.y - mapCenterY;

      // 更新前先清除一波
      this.clearMap();
      // 复制之前父地图到自地图中
      for (let i = 0; i < this.numXs; i++) {
        for (let j = 0; j < this.numYs; j++) {
          if (props.positions[`${i + xC}:${j + yC}`]) {
            this.dataMap[i][j].value = 0;
            this.dataMap[i][j].color = color;
          }
        }
      }
    }

    const { showType, mapColorRandom, lifeCycle } = props;
    if (
      showType === "average" ||
      showType === "random-fill" ||
      showType === "average-vertical"
    ) {
      this.labelQueue = [];
      setTimeout(() => {
        lifeCycle && lifeCycle.beforeMounted && lifeCycle.beforeMounted();
      });
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
      setTimeout(() => {
        lifeCycle && lifeCycle.mounted &&  lifeCycle.mounted(this.labelQueue);
      });
    }
  }

  doDidMounted() {
    if (this.ctx) {
      const { showLine, gridSize = 10 } = this.props;
      ItemGridSize = gridSize;
      this.initDataMap(this.ctx);
      if(Object.keys(this.props).length>0){
        this.renderGrid(this.props);
      }
      this.registerListener();
      if (showLine) {
        addAuxiliaryLine(this.ctx, ItemGridSize);
      }
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
