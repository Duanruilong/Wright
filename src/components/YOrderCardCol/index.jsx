import React, { useState } from "react";
import { View, Image } from "@tarojs/components";
import YNumIncrease from "@/components/YNumIncrease";
import YScore from "@/components/YScore";
import YCollection from "@/components/YCollection";
import { isCurrency, conCurrency, isEmpty } from "@/utils/utils";
import "./index.scss";

/**
 * YOrderCardCol 竖向布局
 * @param className: 样式名
 * @param select: 是否选择内容
 * @param increase: 是否显示计数
 * @param score: 是否显示评价及数量
 * @param tag: 是否显示tag
 */

const YOrderCardCol = props => {
  const { data, children } = props;
  return (
    <View className="y-order-card-col">
      <Image
        className={"y-order-card-col-img"}
        src={data?.icon}
        mode="aspectFit"
      />
      <View className={"y-order-card-col-center"}>
        <View className={"y-order-card-col-center-title"}>
          <View
            className={"y-order-card-col-center-title-text"}
            numberOfLines={1}
          >
            {data?.title}
          </View>
          <YCollection like={data?.islike} recommendId={data?.recommendid} />
        </View>
        <View
          className={`y-order-card-col-center-descriptor`}
          numberOfLines={1}
        >
          {data?.descript}
        </View>
        <View className={"y-order-card-col-center-comments"}>
          <YScore selected={data?.comments} />
          <View className={"y-order-card-col-center-comments-buy"}>
            {data?.buy}
          </View>
        </View>
        <View className={"y-order-card-col-center-price"}>
          <View className={"y-order-card-col-center-price-center"}>
            {isCurrency(data?.unit)}
            {conCurrency(data?.price, 2)}
          </View>
          <View className={"y-order-card-col-center-price-originative"}>
            {conCurrency(data?.originprice, 2)}
          </View>
        </View>
      </View>
      {children}
    </View>
  );
};

export default YOrderCardCol;
