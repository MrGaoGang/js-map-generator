type PointType = {
  x: number;
  y: number;
};

type MapItemInfoType = {
  center: PointType; // 地图中心点
  name: string; // 地图名称
  id: string; // 地图id
  color: string; // 地图颜色
  positions: {
    // 占用地图的map
    [key: string]: boolean;
  };
  index: number; // 数据层的index
  textColor: string;
  datas?: ItemMapData[]; // 子地图的数据
};

// 传入给地图组件的数据
type ItemMapData = {
  name: string; // 名称
  value: number; // 值
  color?: string; // 颜色
  textColor?: string; // 文本颜色
  direction?: number;
  id?: string;
  children?: ItemMapData[];
};

// 数据地图的类型
type DataMapType = Array<{
  value: number;
  name: string;
  color?: string;
}>[];

type BaseProps = {
  mapWidth: number; // 地图宽度
  mapHeight: number; // 地图高度
  gridSize: number; // 网格宽高
  mapColorRandom?: boolean; // 是否随机生成地图颜色
  showLine?: boolean; // 是否显示辅助线
  showLabel?: boolean; // 是否展示地图标签
  label?: {
    // 标签信息
    color: string; // 标签颜色
    fontSize: number; // 标签字体
    fontWeight: "bold" | number;
    fontFamily: string; // 字体
    labelDirection: "verticel" | "horizontal"; // 标签渲染方向
  };
  lifeCycle?: {
    beforeMounted?: () => void; // 开始渲染钱
    mounted?: (maps: MapItemInfoType[]) => void; // 地图已经渲染完成
  };
};
