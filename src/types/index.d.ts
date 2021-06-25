type PointType = {
  x: number;
  y: number;
};

type MapItemInfoType = {
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

type ItemMapData = {
  name: string;
  value: number;
  color?: string;
  children?: ItemMapData[];
};

type DataMapType = Array<{
  value: number;
  name: string;
  color?: string;
}>[];

type BaseProps = {
  mapWidth: number;
  mapHeight: number;
  gridSize: number;
  mapColorRandom?: boolean;
};
