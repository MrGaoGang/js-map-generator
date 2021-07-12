export declare class Filler {
    value: number;
    name: string;
    xCount: number;
    yCount: number;
    frontierCount: number;
    frontiers: {
        [prop: string]: boolean;
    };
    color: string;
    constructor(value: number, name: string, xCount: number, yCount: number);
    _getContiguous(frontier: PointType): {
        x: number;
        y: number;
    }[];
    _getSkewContiguous(frontier: PointType): {
        x: number;
        y: number;
    }[];
    changeMapItem(dataMap: DataMapType, x: number, y: number): void;
    getMapInfo(): {
        x: number[];
        y: number[];
    };
    getCenterMap(): {
        x: number;
        y: number;
    };
    getSpaceMapEdge(dataMap: DataMapType): {
        x: number;
        y: number;
    };
    filterCanUse(dataMap: DataMapType, coors: {
        x: number;
        y: number;
    }[]): {
        x: number;
        y: number;
    }[];
    fill(dataMap: DataMapType, start: PointType): void;
}
//# sourceMappingURL=Filler.d.ts.map