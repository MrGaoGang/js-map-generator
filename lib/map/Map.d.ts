/**
 * 每个基础网格的信息
 * @param {*} value
 * @param {*} color
 */
export declare class MapItem {
    value: number;
    color: string;
    constructor(value: number, color: string);
}
export declare const ItemGridSize = 10;
export declare const ItemGridValue = 10;
export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare function getGridCount(value: number): number;
//# sourceMappingURL=Map.d.ts.map