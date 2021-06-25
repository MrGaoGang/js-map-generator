import React, { Component } from "react";
export declare type DetailMapProps = Partial<MapItemInfoType> & Partial<{
    showType: "parent" | "average" | "average-vertical" | "random-fill";
    showLine: boolean;
}> & {
    datas: ItemMapData[];
} & Partial<BaseProps>;
export default class DetailMap extends Component<DetailMapProps> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    numXs: number;
    numYs: number;
    dataMap: DataMapType;
    ctx: CanvasRenderingContext2D | null;
    labelQueue: MapItemInfoType[];
    constructor(props: DetailMapProps);
    drawGridTile(x: number, y: number, color?: string): void;
    clearGrid(): void;
    clearMap(): void;
    draw: () => void;
    drawLabel: (info: MapItemInfoType) => void;
    initDataMap: () => void;
    componentWillUpdate(newProps: DetailMapProps): void;
    updateMap(props: DetailMapProps): void;
    getEventInWhereMap(position: PointType): string;
    registerListener: () => void;
    componentDidMount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=DetailMap.d.ts.map