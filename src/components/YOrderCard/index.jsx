import React, { useState } from "react";
import { View, Image } from "@tarojs/components";
import YNumIncrease from "@/components/YNumIncrease";
import YScore from "@/components/YScore";
import selectNo from "@/assets/select_no.png";
import selectItem from "@/assets/select_yes.png";
import { isCurrency, conCurrency, isEmpty } from "@/utils/utils";
import "./index.scss";

/**
 * YOrderCard
 * @param className: 样式名
 * @param select: 是否选择内容
 * @param increase: 是否显示计数
 * @param score: 是否显示评价及数量
 * @param tag: 是否显示tag
 */

const YOrderCard = props => {
  const {
    disabled,
    data,
    select = false,
    score = false,
    increase = false,
    tag,
    className = null,
    children,
    ...rest
  } = props;

  const [check, setCheck] = useState(select || false);

  // 选中商品
  const onItemClick = item => {
    console.log(check, "onItemClick :>> ", item);
    props.onCheckItem(!check, item);
    setCheck(!check);
  };

  // 修改数量
  const onNumIncrease = values => {
    console.log("修改数量 :>> ", values);
    props.onNumIncrease(values);
  };

  return (
    <View className="y-order-card">
      {select && (
        <View
          onClick={e => {
            if (process.env.TARO_ENV !== "rn") {
              e.stopPropagation();
            }
            onItemClick(data);
          }}
          onStartShouldSetResponderCapture={ev => true}
        >
          <Image
            className="y-order-card-radio"
            mode="aspectFit"
            src={check ? selectItem : selectNo}
          />
        </View>
      )}

      <Image className="y-order-card-img" src={data?.icon} mode="aspectFit" />
      <View
        className={`"y-order-card-cent" ${
          select ? "y-order-card-cent-sel" : "y-order-card-cent"
        }`}
      >
        <View className="y-order-card-cent-title" numberOfLines={1}>
          {data?.title}
          titletitletitletitletitletitle333333
        </View>
        <View className="y-order-card-cent-descriptor" numberOfLines={2}>
          {data?.descript}
        </View>
        {!score && (
          <View className={"y-order-card-cent-comments"}>
            <YScore selected={data?.star} />
            <View className={"y-order-card-cent-comments-buy"}>{data.buy}</View>
          </View>
        )}

        {tag && <View className="y-order-card-cent-info">{data?.title}</View>}
        <View className="y-order-card-cent-inc">
          <View className="y-order-card-cent-inc-price">
            {isCurrency(data?.unit)}
            {conCurrency(data?.price || 0, 2)}
          </View>

          <View className="y-order-card-cent-inc-origin">
            {isCurrency(data?.unit)}
            {conCurrency(data?.originprice || 0, 2)}
          </View>
          {increase && (
            <View className="y-order-card-cent-inc-increase">
              <YNumIncrease
                onChange={values => {
                  onNumIncrease(values);
                }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default YOrderCard;
