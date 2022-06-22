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

/**  * @Author: duanruilong  * @Date: 2022-04-11 14:11:59  * @Desc: Cash  */

const Cash = () => {
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

  const onAddCredits = () => {
    console.log("onAddCredits :>> ", 111111);
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
            <YTitleTask
              key={item?.icon || index}
              onClick={() => {
                // setIsOpened(true);
              }}
              showIcon={false}
              className="cash-score-item"
              title={
                <View className="cash-score-center">
                  <View className="cash-score-center-title">{item?.title}</View>
                  <View className="cash-score-center-time">{item?.price}</View>
                  <View className="cash-score-center-time">{item?.price}</View>
                </View>
              }
              right={
                <View className="cash-score-right">{item?.originprice}</View>
              }
            />
          );
        })}
      </>
    );
  };

  return (
    <View className="cash">
      <View className="cash-list">
        <View className="cash-list-item">
          <View className="cash-list-item-active" numberOfLines={1}>
            {isCurrency(userInfo?.country || COUNTRY)}
            {conCurrency(userInfo?.price || 0, 2)}
          </View>
          <View className="cash-list-item-title">Avaliable</View>
        </View>
        <View className="cash-list-box">
          <YButton yType="default" onClick={onAddCredits}>
            <View className="cash-list-box-but"> Add Credits</View>
          </YButton>
        </View>
      </View>
      <YTitleTask
        showIcon={false}
        className="cash-earn"
        title="HISTORY"
        right={
          <View
            className="cash-earn-item"
            onClick={() => {
              setIsOpened(true);
            }}
          >
            Whats Wright Cash ?
          </View>
        }
      />
      {/* list */}
      <View style={{ height: windowHeight - 230 }}>
        <YListView
          classStyle="cash-score"
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
        <View className="cash-mask">
          <View className="cash-mask-center">
            <View className="cash-mask-center-title">Whats Wright Cash</View>
            <View className="cash-mask-center-center">
              Whats Wright Cash Whats Wright Cash Whats Wright Cash Whats Wright
              Cash Whats Wright Cash
            </View>
          </View>
          <Image className={"cash-mask-image"} src={closeImg} />
        </View>
      </TMask>
    </View>
  );
};

export default Cash;
