# map-generator

按照一定的比例随机生成地图和子地图;

## 效果

| 水平分隔 | 垂直分隔 | 随机分隔 |
| :------- | -------: | :------: |

| <img src="./docs/average.png"  width="400"/>| <img src="./docs/average-v.png"  width="400"/>| <img src="./docs/random.png"  width="400"/>|

## 使用

```js

npm install map-generator

```

## 随机生成父地图

### 使用

```js
import { MainMap } from "map-generator";
// render部分
<MainMap
  mapData={realData}
  callback={(info) => {
    this.setState({
      selectMapInfo: info,
    });
  }}
/>;
```

### 要求的数据结构

```json
[
  {
    "name": "区域1",
    "color": "rgb(0,139,139)",
    "value": 240,
    "children": [
      {
        "name": "子区域1",
        "value": 100
      },
      {
        "name": "子区域2",
        "value": 50
      },
      {
        "name": "子区域3",
        "value": 30
      },
      {
        "name": "子区域4",
        "value": 60
      }
    ]
  },
  {
    "name": "区域2",
    "color": "rgb(30,144,255)",
    "value": 180,
    "children": [
      {
        "name": "子区域1-1",
        "value": 40
      },
      {
        "name": "子区域2-1",
        "value": 50
      },
      {
        "name": "子区域3-1",
        "value": 30
      },
      {
        "name": "子区域4-1",
        "value": 60
      }
    ]
  }
]
```

### API(props)

```js
{
    mapData: ItemMapData[]; // 数据源
  callback?: (info: MapItemInfoType) => void; // 地图点击事件回调
   mapWidth: number; // 地图的宽度 
  mapHeight: number; // 地图的高度
  gridSize: number; //每个格子的宽高
  mapColorRandom?: boolean; //是否随机生成颜色
}

```
