import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * * @Author: duanruilong
 * * @Desc: 进度条
 *  progress 元素进度
 *  title 标题
 *  color 元素color
 * */

const YProgress = props => {
  const { progress, title, color, width = 60, tal, int } = props;
  const frontStyle = () => {
    let values = 1;
    if (progress) {
      if ((width / 100) * progress > width) {
        values = width;
      } else {
        values = (width / 100) * progress;
      }
    }
    if (int) {
      if ((width / tal) * int >= width) {
        values = width;
      } else {
        values = (width / tal) * int;
      }
    }
    if (process.env.TARO_ENV !== "rn") {
      return `${values}px`;
    }
    return values;
  };

  return (
    <View className="progress">
      {title && <View className="progress-title">{title || "正在上传"}</View>}
      <View className="progress-box-back">
        <View
          className="progress-box-front"
          style={{ width: frontStyle(), background: color || "" }}
        ></View>
      </View>
      {tal ? (
        <View className="progress-box-percent">
          {int || 0}/{tal}
        </View>
      ) : (
        <View className="progress-box-percent">{progress || 0}%</View>
      )}
    </View>
  );
};

export default YProgress;
