import * as React from "react";
import MockData from "./mock.json";
import { MainMap, DetailMap } from "js-map-generator";
import { Radio } from "antd";
import "./App.css";

const getRandomColor = function () {
  var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
  while (hex.length < 6) {
    //while循环判断hex位数，少于6位前面加0凑够6位
    hex = "0" + hex;
  }
  return "#" + hex; //返回‘#’开头16进制颜色
};

const realData = MockData.map((ele) => {
  return {
    ...ele,
    children: ele.children
      .sort((a, b) => a.value - b.value)
      .map((ele) => {
        return {
          ...ele,
          color: getRandomColor(),
        };
      }),
  };
}).sort((a, b) => b.value - a.value);
console.log(realData);

export interface IAppProps {}

type MainMapState = {
  selectMapInfo: any;
  showType: string;
  showLabel: number;
  showMap: boolean
};

export default class App extends React.Component<IAppProps, MainMapState> {
  mainMapRef: React.RefObject<MainMap>;
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      selectMapInfo: {},
      showType: "parent",
      showLabel: 1,
      showMap:false
    };
    this.mainMapRef = React.createRef();
  }

  onChange = (e: any) => {
    this.setState({
      showType: e.target.value,
    });
  };

  public render() {
    const { selectMapInfo, showType, showLabel,showMap } = this.state;
    return (
      <div className="main-container">
        <h2>父地图</h2>
        <MainMap
          mapData={realData}
          showLabel={true}
          showLine={true}
          gridSize={10}
          ref={this.mainMapRef}
          lifeCycle={{
            mounted: (maps:any) => {
              // 一个样例，当地图渲染完成之后，获取某个地址是否在地图之内的信息
              const pos = this.mainMapRef.current?.getEventInWhereMap({
                x: 529,
                y: 288,
              });
              if (pos && pos.index !== -1) {
                console.log(maps[pos?.index]);
              }
            },
          }}
          callback={(info: any) => {
            this.setState({
              selectMapInfo: info,
              showMap:true
            });
          }}
        />

        <h2>{selectMapInfo.name}的子地图(请点击父地图中的一块)</h2>

        <h3>1. 子地图展示方式</h3>
        <Radio.Group onChange={this.onChange} value={showType}>
          <Radio value={"parent"}>parent</Radio>
          <Radio value={"average"}>average</Radio>
          <Radio value={"average-vertical"}>average-vertical</Radio>
          <Radio value={"random-fill"}>random-fill</Radio>
        </Radio.Group>

       { showMap &&  <DetailMap
          {...selectMapInfo}
          showLine={true} // 暂不支持动态
          showType={showType}
          mapWidth={800}
          mapHeight={600}
          showLabel={false}
          datas={(selectMapInfo.datas || []).sort(
            (a: any, b: any) => b.value - a.value
          )}
        />}
      </div>
    );
  }
}
