import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import closeImg from "@/assets/close1.png";
import userImg from "@/assets/user_img.png";
import { COUNTRY } from "@/constants";
import YListView from "@/components/YListView";
import YButton from "@/components/YButton";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import YProgress from "@/components/YProgress";
import TMask from "@/components/tinker/TMask";
import { getStorageData, isCurrency, conCurrency } from "@/utils/utils";
import { getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-13 10:52:25  * @Desc: GroupPurchase  */

const GroupPurchase = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const lisPointsRef = useRef(null);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();
  const [show, setShow] = useState(false);
  const [maskData, setMaskData] = useState();

  const getUserInfo = () => {
    const data = getStorageData("userInfo");
    current.userData = data;
    setUserInfo(data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // 跳转商品详情
  const onItemClick = async values => {
    console.log("跳转商品详情 :>> ", values);
    // await Taro.setStorage({
    //   key: "cards_order_data",
    //   data: { order: values, data: [values] }
    // });
    // Taro.navigateTo({
    //   url: "/pagesGoods/order/index?disable=true"
    // });
  };

  const onCancelClick = (values, type) => {
    console.log(type, "onCancelClick :>> ", values);
    // if (type === "Review") {
    //   Taro.navigateTo({
    //     url: `/pagesGoods/orderReview/index?type=${type}`
    //   });
    // } else {
    //   Taro.navigateTo({
    //     url: `/pagesGoods/orderReturn/index?type=${type}`
    //   });
    // }
  };

  const renderList = values => {
    const { data } = values;
    console.log("data :>> ", data);
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return (
      <>
        {data.map((item, index) => {
          return (
            <View
              key={item?.icon || index}
              onClick={() => {
                onItemClick(item);
              }}
              className="user-group-score-cent"
            >
              <YTitleTask
                showIcon={false}
                className="user-group-score-cent-top"
                title={
                  <View className="user-group-score-cent-top-center">
                    <View className="user-group-score-cent-top-center-title">
                      Order ID:
                      <Text className="user-group-score-cent-top-center-title-text">
                        &nbsp;{item?.recommendid}
                      </Text>
                    </View>
                    <View className="user-group-score-cent-top-center-title">
                      Order Date:
                      <Text className="user-group-score-cent-top-center-title-text">
                        &nbsp;{item?.title}
                      </Text>
                    </View>
                  </View>
                }
                right={
                  <View className="user-group-score-cent-top-right">
                    Pending
                  </View>
                }
              />
              <View className="user-group-score-cent-item">
                <View className="user-group-score-cent-item-ban">
                  <Image
                    className={"user-group-score-cent-item-ban-img"}
                    src={item?.icon}
                    mode="aspectFill"
                  />
                </View>
                <View className="user-group-score-cent-item-cont">
                  <View
                    className="user-group-score-cent-item-cont-title"
                    numberOfLines={2}
                  >
                    {item?.title}
                  </View>
                  <View
                    className="user-group-score-cent-item-cont-info"
                    numberOfLines={2}
                  >
                    {item?.descript}
                  </View>
                  <View className="user-group-score-cent-item-cont-tex">
                    {item?.recommendid}
                  </View>
                  <View className="user-group-score-cent-item-cont-bot">
                    <View className="user-group-score-cent-item-cont-bot-pro">
                      <YProgress tal={10} int={3} />
                    </View>
                    <View
                      className="user-group-score-cent-item-cont-bot-but"
                      onClick={e => {
                        if (process.env.TARO_ENV !== "rn") {
                          e.stopPropagation();
                        }
                        setMaskData(item);
                        setShow(true);
                      }}
                    >
                      Share
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View className="user-group">
      {/* list */}
      <View style={{ height: windowHeight - 60 }}>
        <YListView
          classStyle="user-group-score"
          renderList={renderList}
          request={getRecommend}
          extraParams={{
            country: COUNTRY,
            kindid: 1,
            type: 1
          }}
          ref={lisPointsRef}
        />
      </View>
      {/* mask-Share */}
      <TMask
        visible={show}
        // onConfirm={() => {
        //   setShow(false);
        // }}
        // onClose={() => {
        //   setShow(false);
        // }}
      >
        <View className="user-group-mask">
          <View
            className="user-group-mask-clo"
            onClick={() => {
              setShow(false);
            }}
          >
            <Image className={"user-group-mask-clo-img"} src={closeImg} />
          </View>
          <View className="user-group-mask-center">
            <View className="user-group-mask-center-top">
              <View className="user-group-mask-center-top-ban">
                <Image
                  className={"user-group-mask-center-top-ban-img"}
                  src={maskData?.icon}
                  mode="aspectFill"
                />
              </View>
              <View className="user-group-mask-center-top-rt">
                <Text className="user-group-mask-center-top-rt-text">
                  {isCurrency(userInfo?.country || COUNTRY)}
                  {conCurrency(maskData?.price || 0, 2)}
                </Text>
                <View className="user-group-mask-center-top-rt-orig">
                  <Text className="user-group-mask-center-top-rt-orig-text">
                    {isCurrency(userInfo?.country || COUNTRY)}
                    {conCurrency(maskData?.price || 0, 2)}
                  </Text>
                  <Text className="user-group-mask-center-top-rt-orig-int">
                    {isCurrency(userInfo?.country || COUNTRY)}
                    {conCurrency(maskData?.price || 0, 2)}
                  </Text>
                </View>
                <View className="user-group-mask-center-top-rt-tag">
                  <View className="user-group-mask-center-top-rt-tag-cont">
                    {maskData?.title}
                  </View>
                </View>
              </View>
            </View>
            <View className="user-group-mask-center-gro">
              <View className="user-group-mask-center-gro-text">Grouping</View>
              <View className="user-group-mask-center-gro-info">
                {maskData?.title}
              </View>
            </View>
            <View className="user-group-mask-center-pro">
              <YProgress tal={10} int={3} />
            </View>
            <View className="user-group-mask-center-title">Description</View>
            <View className="user-group-mask-center-info" numberOfLines={3}>
              {maskData?.descript}
            </View>
            <View className="user-group-mask-center-title">Member</View>
            <View className="user-group-mask-center-score">
              <ScrollView
                style={{
                  height: 20
                }}
                className="user-group-mask-center-score"
                scrollY
                scrollWithAnimation
              >
                {[1, 2, 3, 4, 5].map((item, index) => {
                  return (
                    <View
                      className="user-group-mask-center-score-item"
                      key={index}
                    >
                      <YTitleTask
                        showIcon={false}
                        className="user-group-mask-center-score-item-cot"
                        title={
                          <View className="user-group-mask-center-score-item-cot-center">
                            <Image
                              className={
                                "user-group-mask-center-score-item-cot-center-image"
                              }
                              src={userImg}
                              mode="aspectFit"
                            />
                            <View className="user-group-mask-center-score-item-cot-center-info">
                              <View
                                numberOfLines={2}
                                className="user-group-mask-center-score-item-cot-center-info-tit"
                              >
                                {maskData?.title}
                              </View>
                              <View
                                numberOfLines={2}
                                className="user-group-mask-center-score-item-cot-center-info-tex"
                              >
                                {maskData?.title}
                              </View>
                            </View>
                          </View>
                        }
                        right={
                          <View className="user-group-mask-center-score-item-cot-right">
                            {maskData?.title}
                          </View>
                        }
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            {/* button */}
            <View className="user-group-mask-center-but">
              <YButton yType="default" onClick={() => {}}>
                <View className="user-group-mask-center-but-cent">
                  Share Products
                </View>
              </YButton>
            </View>
          </View>
        </View>
      </TMask>
    </View>
  );
};

export default GroupPurchase;
