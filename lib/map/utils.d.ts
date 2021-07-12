export declare function addAuxiliaryLine(ctx: CanvasRenderingContext2D, ItemGridSize: number): void;
export declare function getEventPosition(ev: any): {
    x: any;
    y: any;
};
export declare const getRandomColor: () => string;
declare enum SubMapDirection {
    T = 0,
    TXR = 1,
    R = 2,
    RXB = 3,
    B = 4,
    BXL = 5,
    L = 6,
    LXT = 7
}
/**
 * 获取某个方向的空余
 * @param dataMap
 * @param direction
 */
export declare function getSpaceCenter(dataMap: DataMapType, direction: SubMapDirection): {
    x: number;
    y: number;
};
export declare function trampoline(f: any): any;
export {};
//# sourceMappingURL=utils.d.ts.map