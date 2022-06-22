import React from "react";
import { View, Image } from "@tarojs/components";
import classnames from "classnames";
import rightImg from "./right.png";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-11 14:12:30
 *  @Desc: YTitleTask
 *  showIcon : 显示右侧箭头，默认为true
 *  right ： 自定义右侧内容区域
 *  isEdit ： 是否为可编辑状态，默认为false
 */

const YTitleTask = props => {
  const {
    showIcon = true,
    isEdit = false,
    right,
    title,
    className,
    style
  } = props;

  const onClick = () => {
    if (!isEdit) {
      props.onClick && props.onClick();
    }
  };

  return (
    <View
      style={style}
      className={`y-title-task ${className}`}
      onClick={onClick}
    >
      <View className={"y-title-task-title"}>{title}</View>
      <View className={"y-title-task-right"}>
        {right}
        {showIcon && (
          <Image className={"y-title-task-right-image"} src={rightImg} />
        )}
      </View>
    </View>
  );
};

export default YTitleTask;
