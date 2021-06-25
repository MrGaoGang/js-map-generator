import * as React from "react";
import MockData from "./mock.json";
import { MainMap, DetailMap } from "js-map-generator";
import { Radio } from "antd";
import './App.css';

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
});

export interface IAppProps {}

type MainMapState = {
  selectMapInfo: any;
  showType: string;
  showLabel: number;
};

export default class App extends React.Component<IAppProps, MainMapState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      selectMapInfo: {},
      showType: "parent",
      showLabel: 1,
    };
  }

  onChange = (e: any) => {
    this.setState({
      showType: e.target.value,
    });
  };
  public render() {
    const { selectMapInfo, showType, showLabel } = this.state;
    return (
      <div className="main-container">
        <h2>父地图</h2>
        <MainMap
          mapData={realData}
          showLabel={true}
          showLine={true}
          callback={(info: any) => {
            this.setState({
              selectMapInfo: info,
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


        <DetailMap
          {...selectMapInfo}
          showLine={true} // 暂不支持动态
          showType={showType}
          mapWidth = {800}
          mapHeight = {600}
          showLabel={false}
          datas={selectMapInfo.datas || []}
        />
      </div>
    );
  }
}
