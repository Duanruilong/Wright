import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import closeImg from "@/assets/close_2.png";
import { COUNTRY } from "@/constants";
import YListView from "@/components/YListView";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import TMask from "@/components/tinker/TMask";
import { getStorageData } from "@/utils/utils";
import { getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-11 14:11:59  * @Desc: Points  */

const Points = () => {
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
            <YTitleTask
              key={item?.icon || index}
              onClick={() => {
                // setIsOpened(true);
              }}
              showIcon={false}
              className="points-score-item"
              title={
                <View className="points-score-center">
                  <View className="points-score-center-title">
                    {item?.title}
                  </View>
                  <View className="points-score-center-time">
                    {item?.price}
                  </View>
                </View>
              }
              right={
                <View className="points-score-right">{item?.originprice}</View>
              }
            />
          );
        })}
      </>
    );
  };

  return (
    <View className="points">
      <View className="points-list">
        <View className="points-list-item">
          <View className="points-list-item-name" numberOfLines={1}>
            {userInfo?.point || 0}
          </View>
          <View className="points-list-item-title">Used</View>
        </View>
        <View className="points-list-item">
          <View className="points-list-item-active" numberOfLines={1}>
            {userInfo?.cash || 0}
          </View>
          <View className="points-list-item-title">Available</View>
        </View>
        <View className="points-list-item">
          <View className="points-list-item-name" numberOfLines={1}>
            {userInfo?.coupon || 0}
          </View>
          <View className="points-list-item-title">Expired</View>
        </View>
      </View>
      <YTitleTask
        showIcon={false}
        className="points-earn"
        title="HISTORY"
        right={
          <View
            className="points-earn-item"
            onClick={() => {
              setIsOpened(true);
            }}
          >
            How to Earn Points ?
          </View>
        }
      />
      {/* list */}
      <View style={{ height: windowHeight - 230 }}>
        <YListView
          classStyle="points-score"
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
        <View className="points-mask">
          <View className="points-mask-center">
            <View className="points-mask-center-title">How to Earn Points</View>
            <View className="points-mask-center-center">
              22222222222222222222第三方士大夫22222333333333333333ff33333
            </View>
          </View>
          <Image className={"points-mask-image"} src={closeImg} />
        </View>
      </TMask>
    </View>
  );
};

export default Points;
