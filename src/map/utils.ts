export function addAuxiliaryLine(
  ctx: CanvasRenderingContext2D,
  ItemGridSize: number
) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  var xLineTotals = Math.floor(canvasHeight / ItemGridSize); // 计算需要绘画的x轴条数
  var yLineTotals = Math.floor(canvasWidth / ItemGridSize); // 计算需要绘画y轴的条数

  // 零时使用的
  for (var i = 0; i < xLineTotals; i++) {
    ctx.beginPath(); // 开启路径，设置不同的样式
    ctx.moveTo(0, ItemGridSize * i - 0.5); // -0.5是为了解决像素模糊问题
    ctx.lineTo(canvasWidth, ItemGridSize * i - 0.5);
    ctx.strokeStyle = "#ccc"; // 设置每个线条的颜色
    ctx.stroke();
  }

  // 4.采用遍历的方式，绘画y轴的线条
  for (var j = 0; j < yLineTotals; j++) {
    ctx.beginPath(); // 开启路径，设置不同的样式
    ctx.moveTo(ItemGridSize * j, 0);
    ctx.lineTo(ItemGridSize * j, canvasHeight);
    ctx.strokeStyle = "#ccc"; // 设置每个线条的颜色
    ctx.stroke();
  }
}

export function getEventPosition(ev: any) {
  var x, y;
  if (ev.layerX || ev.layerX === 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX === 0) {
    x = ev.offsetX;
    y = ev.offsetY;
  }
  return { x: x, y: y };
}

export const getRandomColor = function () {
  var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
  while (hex.length < 6) {
    //while循环判断hex位数，少于6位前面加0凑够6位
    hex = "0" + hex;
  }
  return "#" + hex; //返回‘#’开头16进制颜色
};

enum SubMapDirection {
  T, // 上
  TXR, //右上角
  R, //右
  RXB, // 右下角
  B, // 下
  BXL, // 左下角
  L, //左
  LXT, // 左上角
}

/**
 * 获取某个方向的空余
 * @param dataMap
 * @param direction
 */
export function getSpaceCenter(
  dataMap: DataMapType,
  direction: SubMapDirection
): { x: number; y: number } {
  let xC = dataMap.length;
  let yC = dataMap[0].length;

  let xH = Math.floor(xC / 2);
  let yH = Math.floor(yC / 2);

  const result = {
    x: -1,
    y: -1,
  };

  function isEmpty(ele: ItemMapData) {
    return ele.value === -1;
  }

  // 上或者下
  if (direction === SubMapDirection.T || direction === SubMapDirection.B) {
    for (
      let y = yH;
      direction === SubMapDirection.T ? y >= 0 : y < yC;
      direction === SubMapDirection.T ? y-- : y++
    ) {
      const ele = dataMap[xH][y];
      if (isEmpty(ele)) {
        return {
          x: xH,
          y,
        };
      }
    }

    return result;
  }
  // 左或者右边
  if (direction === SubMapDirection.R || direction === SubMapDirection.L) {
    for (
      let x = 0;
      direction === SubMapDirection.R ? x < xC : x >= 0;
      direction === SubMapDirection.R ? x++ : x--
    ) {
      const ele = dataMap[x][yH];
      if (isEmpty(ele)) {
        return {
          x,
          y: yH,
        };
      }
    }

    return result;
  }

  const minCount = Math.min(yH, xH);
  for (let i = 0; i < minCount; i++) {
    // 右下
    if (direction === SubMapDirection.RXB) {
      const ele = dataMap[xH + i][yH + i];
      if (isEmpty(ele)) {
        return {
          x: xH + i,
          y: yH + i,
        };
      }
    } else if (direction === SubMapDirection.TXR) {
      // 右上
      const ele = dataMap[xH + i][yH - i];
      if (isEmpty(ele)) {
        return {
          x: xH + i,
          y: yH - i,
        };
      }
    } else if (direction === SubMapDirection.BXL) {
      // 右上
      const ele = dataMap[xH - i][yH + i];
      if (isEmpty(ele)) {
        return {
          x: xH - i,
          y: yH + i,
        };
      }
    } else if (direction === SubMapDirection.LXT) {
      // 右上
      const ele = dataMap[xH - i][yH - i];
      if (isEmpty(ele)) {
        return {
          x: xH - i,
          y: yH - i,
        };
      }
    } else {
      break;
    }
  }

  return result;
}
