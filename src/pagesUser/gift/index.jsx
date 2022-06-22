import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import closeImg from "@/assets/close_2.png";
import { COUNTRY } from "@/constants";
import YListView from "@/components/YListView";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import YButton from "@/components/YButton";
import TMask from "@/components/tinker/TMask";
import { getStorageData, isCurrency, conCurrency } from "@/utils/utils";
import { getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-13 10:47:00  * @Desc: Gift  */
const Gift = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const lisPointsRef = useRef(null);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();
  const [isOpened, setIsOpened] = useState(false);

  const getUserInfo = () => {
    const data = getStorageData("userInfo");
    current.userData = data;
    setUserInfo(data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const onGetMore = () => {};

  const onItemClick = values => {
    console.log("values :>> ", values);
  };

  const onDetailClick = values => {
    console.log("onDetailClick :>> ", values);
  };

  const renderList = values => {
    const { data } = values;
    console.log("data :>> ", data);
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return (
      <>
        <YTitleTask
          showIcon={false}
          className="user-gift-earn"
          title="Avaliable"
          right={
            <View
              className="user-gift-earn-item"
              onClick={() => {
                setIsOpened(true);
              }}
            >
              What's Gift Card ?
            </View>
          }
        />
        {data.map((item, index) => {
          return (
            <View
              key={item?.icon || index}
              onClick={() => {
                onItemClick(item);
              }}
              className="user-gift-score-item"
            >
              <View className="user-gift-score-item-center">
                <View className="user-gift-score-item-center-left">
                  {isCurrency(userInfo?.country || COUNTRY)}
                  {conCurrency(item?.price || 0, 2)}
                </View>
                <View className="user-gift-score-item-center-right">
                  <View className="user-gift-score-item-center-right-title">
                    <View className="user-gift-score-item-center-right-title-text">
                      Coupons
                    </View>
                  </View>
                  <View
                    className="user-gift-score-item-center-right-info"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </View>
                  <View
                    className="user-gift-score-item-center-right-info"
                    numberOfLines={1}
                  >
                    From: oteNoteNoteNoteNote{item?.title}
                  </View>
                  <View
                    className="user-gift-score-item-center-right-info"
                    numberOfLines={1}
                  >
                    Note: oteNoteNoteNoteNote
                    {item?.title}
                  </View>
                  {/* <View
                    className="user-gift-score-item-center-right-detail"
                    onClick={e => {
                      if (process.env.TARO_ENV !== "rn") {
                        e.stopPropagation();
                      }
                      onDetailClick(item);
                    }}
                  >
                    Detail
                  </View> */}
                </View>
              </View>
            </View>
          );
        })}
        <YTitleTask
          showIcon={false}
          className="user-gift-history"
          title="HISTORY"
          right={
            <View
              className="user-gift-earn-item"
              onClick={() => {
                setIsOpened(true);
              }}
            >
              What's Gift Card ?
            </View>
          }
        />
        {data.map((item, index) => {
          return (
            <View
              key={item?.icon || index}
              onClick={() => {
                onItemClick(item);
              }}
              className="user-gift-score-item"
            >
              <View className="user-gift-score-item-center">
                <View className="user-gift-score-item-center-used">
                  {isCurrency(userInfo?.country || COUNTRY)}
                  {conCurrency(item?.price || 0, 2)}
                </View>
                <View className="user-gift-score-item-center-right">
                  <View className="user-gift-score-item-center-right-title">
                    <View className="user-gift-score-item-center-right-title-text">
                      Coupons
                    </View>
                    <View className="user-gift-score-item-center-right-title-box">
                      <View className="user-gift-score-item-center-right-title-box-used">
                        Used
                      </View>
                    </View>
                  </View>
                  <View
                    className="user-gift-score-item-center-right-info"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </View>
                  <View
                    className="user-gift-score-item-center-right-info"
                    numberOfLines={1}
                  >
                    From:{item?.title}
                  </View>
                  <View
                    className="user-gift-score-item-center-right-info"
                    numberOfLines={1}
                  >
                    Note:{item?.title}
                  </View>
                  {/* <View
                    className="user-gift-score-item-center-right-detail"
                    onClick={onGetMore}
                  >
                    Detail
                  </View> */}
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View className="user-gift">
      <View className="user-gift-list">
        <View className="user-gift-list-item">
          <View className="user-gift-list-item-active" numberOfLines={1}>
            {isCurrency(userInfo?.country || COUNTRY)}
            {conCurrency(userInfo?.price || 0, 2)}
          </View>
          <View className="user-gift-list-item-title">Avaliable</View>
        </View>
        <View className="user-gift-list-box">
          <YButton yType="default" onClick={onGetMore}>
            <View className="user-gift-list-box-but">Use It Now</View>
          </YButton>
        </View>
      </View>

      {/* list */}
      <View style={{ height: windowHeight - 160 }}>
        <YListView
          classStyle="user-gift-score"
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

      {/* TMask */}
      <TMask
        visible={isOpened}
        onConfirm={() => {
          setIsOpened(false);
        }}
        onClose={() => {
          setIsOpened(false);
        }}
      >
        <View className="user-gift-mask">
          <View className="user-gift-mask-center">
            <View className="user-gift-mask-center-title">
              What's Gift Card
            </View>
            <View className="user-gift-mask-center-center">
              What's Gift CardWhat's Gift CardWhat's Gift CardWhat's Gift
              CardWhat's Gift Card
            </View>
          </View>
          <Image className={"user-gift-mask-image"} src={closeImg} />
        </View>
      </TMask>
    </View>
  );
};

export default Gift;
