import React from "react";
import "./polyfill";
import BaseMap from "./BaseMap";
declare type MainMapProps = {
    mapData: ItemMapData[];
    callback?: (info: MapItemInfoType) => void;
} & Partial<BaseProps>;
export default class MainMap extends BaseMap<MainMapProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    numXs: number;
    numYs: number;
    dataMap: DataMapType;
    ctx: CanvasRenderingContext2D | null;
    labelQueue: MapItemInfoType[];
    constructor(props: MainMapProps);
    doDidMounted(): void;
    doRender(): JSX.Element;
}
export {};
//# sourceMappingURL=MainMap.d.ts.map