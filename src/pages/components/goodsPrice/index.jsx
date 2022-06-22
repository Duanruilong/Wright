import React, { useState, useEffect, useRef } from "react";
import { View } from "@tarojs/components";
import { isCurrency, conCurrency } from "@/utils/utils";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-19 10:19:23  * @Desc: 商品价格  */
const GoodsPrice = props => {
  const { infoData, selectData, data } = props;

  const [allPrice, setAllPrice] = useState(0);

  // 计算总价
  const calculatePrice = values => {
    let tael = 0;
    for (let i = 0; i < values.length; i++) {
      const element = values[i];
      tael += element.price * element.num;
    }
    setAllPrice(tael);
  };

  useEffect(() => {
    calculatePrice(selectData);
  }, [props, selectData]);

  return (
    <View className="goods-price">
      <View className="goods-price-off">
        {isCurrency(infoData?.country)}
        {conCurrency(allPrice, 2)} OFF
      </View>
      <View className="goods-price-pice">
        {isCurrency(infoData?.country)}
        {conCurrency(allPrice, 2)}
      </View>
    </View>
  );
};

export default GoodsPrice;
