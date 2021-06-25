import React, { Component } from "react";
import "./polyfill";
declare type MainMapProps = {
    mapData: ItemMapData[];
    callback?: (info: MapItemInfoType) => void;
} & Partial<BaseProps>;
declare type MainMapState = {
    selectMapInfo: Partial<MapItemInfoType>;
};
export default class MainMap extends Component<MainMapProps, MainMapState> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    numXs: number;
    numYs: number;
    dataMap: DataMapType;
    ctx: CanvasRenderingContext2D | null;
    labelQueue: MapItemInfoType[];
    constructor(props: MainMapProps);
    drawGridTile(x: number, y: number, color?: string): void;
    draw: () => void;
    drawLabel: (info: MapItemInfoType) => void;
    initDataMap: (ctx: CanvasRenderingContext2D) => void;
    changeMapItem(x: number, y: number): void;
    getEventInWhereMap(position: PointType): {
        id: string;
        index: number;
    };
    registerListener: () => void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=MainMap.d.ts.map