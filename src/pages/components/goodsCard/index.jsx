import React, { useEffect, useRef } from "react";
import { View, Image } from "@tarojs/components";
import Taro, { eventCenter, useDidShow } from "@tarojs/taro";
import YScore from "@/components/YScore";
import YCollection from "@/components/YCollection";
import { isCurrency, conCurrency } from "@/utils/utils";
import "./index.scss";

/**
 * @Author: duanruilong
 * @Date: 2022-04-07 16:28:14
 * @Desc:  GoodsCard 商品orderCard
 *
 * */

const GoodsCard = props => {
  const { data } = props;

  return (
    <View className="goods">
      {data.map((item, index) => {
        return (
          <View className="goods-list" key={item.icon || index}>
            <Image
              className={"goods-list-image"}
              src={item.icon}
              mode="aspectFit"
            />
            <View className={"goods-list-center"}>
              <View className={"goods-list-center-title"}>
                <View
                  className={"goods-list-center-title-text"}
                  numberOfLines={1}
                >
                  {item.title}
                </View>
                <YCollection
                  like={item.islike}
                  recommendId={item.recommendid}
                />
              </View>
              <View
                className={`goods-list-center-descriptor`}
                numberOfLines={1}
              >
                {item.descript}
              </View>
              <View className={"goods-list-center-comments"}>
                <YScore selected={item.comments} />
                <View className={"goods-list-center-comments-buy"}>
                  {item.buy}
                </View>
              </View>
              <View className={"goods-list-center-price"}>
                <View className={"goods-list-center-price-center"}>
                  {isCurrency(item.unit)}
                  {conCurrency(item.price, 2)}
                </View>
                <View className={"goods-list-center-price-originative"}>
                  {conCurrency(item.originprice, 2)}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default GoodsCard;
