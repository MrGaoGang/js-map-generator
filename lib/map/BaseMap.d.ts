import React, { Component } from "react";
declare type BasePropsLife = {
    callback?: (info: MapItemInfoType) => void;
};
export default class BaseMap<T> extends Component<T & Partial<BaseProps> & BasePropsLife> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    numXs: number;
    numYs: number;
    dataMap: DataMapType;
    ctx: CanvasRenderingContext2D | null;
    labelQueue: MapItemInfoType[];
    constructor(props: T & Partial<BaseProps> & BasePropsLife);
    doRender(): JSX.Element;
    doDidMounted(): void;
    drawGridTile(x: number, y: number, color?: string): void;
    draw: () => void;
    drawLabel: (info: MapItemInfoType) => void;
    initDataMap: (ctx: CanvasRenderingContext2D) => void;
    getEventInWhereMap(position: PointType): {
        id: string;
        index: number;
    };
    registerListener: () => void;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=BaseMap.d.ts.map