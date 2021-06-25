export type PointType = {
  x: number;
  y: number;
};

export type MapItemInfoType = {
  center: PointType;
  name: string;
  id: string;
  color: string;
  positions: {
    [key: string]: boolean;
  };
  textColor: string;
  index: number;
  children?: ItemMapData[];
};

export type ItemMapData = {
  name: string;
  value: number;
  color?: string;
  children?: ItemMapData[];
};

export type DataMapType = Array<{
  value: number;
  name: string;
  color?: string;
}>[];

export type BaseProps = {
  mapWidth: number;
  mapHeight: number;
  gridSize: number;
  mapColorRandom?: boolean;
};
