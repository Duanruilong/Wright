import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import closeImg from "@/assets/close.png";
import { COUNTRY } from "@/constants";
import YListView from "@/components/YListView";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import YButton from "@/components/YButton";
import TMask from "@/components/tinker/TMask";
import { getStorageData, isCurrency, conCurrency } from "@/utils/utils";
import { getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-13 10:16:08  * @Desc: Notifications  */

const Notifications = () => {
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

  const onAddCredits = () => {};

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
              className="notifications-score-item"
              title={
                <View className="notifications-score-item-cent">
                  <Image
                    className="notifications-score-item-cent-img"
                    src={item?.icon}
                    mode="aspectFit"
                  />

                  <View className="notifications-score-item-cent-title">
                    <View
                      className="notifications-score-item-cent-title-text"
                      numberOfLines={2}
                    >
                      {item?.title}
                    </View>
                    <View
                      className="notifications-score-item-cent-title-info"
                      numberOfLines={2}
                    >
                      {item?.descript}
                    </View>
                  </View>
                </View>
              }
              right={
                <View className="notifications-score-item-rt">
                  <View className="notifications-score-item-rt-tim">
                    {item?.price}
                  </View>
                  <View className="notifications-score-item-rt-box">3</View>
                </View>
              }
            />
          );
        })}
      </>
    );
  };

  return (
    <View className="notifications">
      {/* list */}
      <View style={{ height: windowHeight }}>
        <YListView
          classStyle="notifications-score"
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
    </View>
  );
};

export default Notifications;
