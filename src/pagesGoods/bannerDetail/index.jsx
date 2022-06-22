import { useState, useEffect, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import classnames from "classnames";
import YOrderCardCol from "@/components/YOrderCardCol";
import { COUNTRY } from "@/constants";
import { getStorageData, isEmpty } from "@/utils/utils";
import { getRecommend } from "./service";

import "./index.scss";

/**
 * @Author: duanruilong
 * @Date: 2022-04-26 11:07:28
 * @Desc: 商品详情页   BannerDetail
 * */

const BannerDetail = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const { current } = useRef({
    infoData: null
  });
  const [params] = useState(Current.router.params);
  const [goodsData, setGoodsData] = useState();

  useEffect(() => {
    getStorageData("userInfo").then(values => {
      current.infoData = values;
      onRecommend(values?.userid);
    });
  }, []);

  const onRecommend = values => {
    getRecommend({
      country: COUNTRY,
      kindid: 1,
      type: 1
    })
      .then(res => {
        const data = res.data;
        setGoodsData(data);
      })
      .catch(() => {});
  };

  const onItemGoods = values => {
    console.log("onItemGoods :>> ", values);
    Taro.navigateTo({
      url: `/pagesGoods/detail/index?goodsId=${values.recommendid}`
    });
  };
  console.log(goodsData?.price, "goodsData :>> ", goodsData);

  if (isEmpty(goodsData)) {
    return null;
  }

  return (
    <View className="banner-detail">
      <ScrollView
        style={{ height: windowHeight - 120 }}
        className="banner-detail-score"
        scrollY
        lowerThreshold={100}
        scrollWithAnimation
        refresherBackground={"#F3F5F8"}
      >
        <Image
          className={"banner-detail-image"}
          src={
            "https://lgj-1257939190.cos.ap-chengdu.myqcloud.com/home/first.png"
          }
          mode="scaleToFill"
        />
        <View className="banner-detail-like">
          {goodsData.map(item => {
            return (
              <View
                key={item.recommendid}
                onClick={() => {
                  onItemGoods(item);
                }}
              >
                <YOrderCardCol data={item} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default BannerDetail;
