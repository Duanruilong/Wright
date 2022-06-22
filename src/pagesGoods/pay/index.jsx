import { useState, useEffect, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, WebView } from "@tarojs/components";
import { getStorageData, isEmpty } from "@/utils/utils";
import { getRecommend } from "./service";

import "./index.scss";

/**
 * @Author: duanruilong
 * @Date: 2022-04-26 11:07:28
 * @Desc: 支付   Pay
 * */

const Pay = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const { current } = useRef({
    infoData: null
  });
  const [params] = useState(Current.router.params);
  const [goodsData, setGoodsData] = useState();

  useEffect(() => {}, []);

  const onRecohandleMessagemmend = values => {
    //   getRecommend({
    //     country: COUNTRY,
    //     kindid: 1,
    //     type: 1
    //   })
    //     .then(res => {
    //       const data = res.data;
    //       setGoodsData(data);
    //     })
    //     .catch(() => {});
  };

  return (
    <View className="pay">
      <WebView src="https://pdcenter.lianlianpay.com/cashier.html" />
    </View>
  );
};

export default Pay;
