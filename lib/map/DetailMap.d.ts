import BaseMap from "./BaseMap";
export declare type DetailMapProps = Partial<MapItemInfoType> & Partial<{
    showType: "parent" | "average" | "average-vertical" | "random-fill";
    callback?: (info: MapItemInfoType) => void;
}> & {
    datas: ItemMapData[];
} & Partial<BaseProps>;
export default class DetailMap extends BaseMap<DetailMapProps> {
    constructor(props: DetailMapProps);
    clearGrid(): void;
    clearMap(): void;
    componentWillUpdate(newProps: DetailMapProps): void;
    updateMap(props: DetailMapProps): void;
    doDidMounted(): void;
    doRender(): JSX.Element;
}
//# sourceMappingURL=DetailMap.d.ts.map