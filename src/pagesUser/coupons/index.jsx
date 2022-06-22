import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Picker } from "@tarojs/components";
import closeImg from "@/assets/close_2.png";
import left from "@/assets/left.png";
import { COUNTRY } from "@/constants";
import YListView from "@/components/YListView";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import YButton from "@/components/YButton";
import TMask from "@/components/tinker/TMask";
import { getStorageData, isCurrency, conCurrency } from "@/utils/utils";
import { getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-11 14:11:59  * @Desc: Coupons  */

const Coupons = () => {
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

  const onGetMore = () => {
    console.log("onGetMore :>> ", 111111);
  };

  const onItemClick = values => {
    console.log("values :>> ", values);
  };
  const onUseItNow = values => {
    console.log("onUseItNow :>> ", values);
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
          className="coupons-earn"
          title="Avaliable"
          right={
            <View
              className="coupons-earn-item"
              onClick={() => {
                setIsOpened(true);
              }}
            >
              How to Obtain Coupons ?
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
              className="coupons-score-item"
            >
              <ItemCard
                data={item}
                userInfo={userInfo}
                onUseItNow={e => {
                  onUseItNow(e);
                }}
              />
            </View>
          );
        })}
        <YTitleTask
          showIcon={false}
          className="coupons-history"
          title="HISTORY"
          right={
            <View
              className="coupons-earn-item"
              onClick={() => {
                setIsOpened(true);
              }}
            >
              How to Obtain Coupons ?
            </View>
          }
        />
        {/* history */}
        {data.map((item, index) => {
          return (
            <View
              key={item?.icon || index}
              onClick={() => {
                onItemClick(item);
              }}
              className="coupons-score-item"
            >
              <View className="coupons-score-item-center">
                <View className="coupons-score-item-center-used">
                  {isCurrency(userInfo?.country || COUNTRY)}
                  {conCurrency(item?.price || 0, 2)}
                </View>
                <View className="coupons-score-item-center-right">
                  <View className="coupons-score-item-center-right-title">
                    <View className="coupons-score-item-center-right-title-text">
                      Coupons
                    </View>
                    <View className="coupons-score-item-center-right-title-box">
                      <View className="coupons-score-item-center-right-title-box-used">
                        Used
                      </View>
                    </View>
                  </View>
                  <View
                    className="coupons-score-item-center-right-info"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </View>
                  <View
                    className="coupons-score-item-center-right-detail"
                    onClick={onGetMore}
                  >
                    Detail
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
    <View className="coupons">
      <View className="coupons-list">
        <View className="coupons-list-item">
          <View className="coupons-list-item-active" numberOfLines={1}>
            {isCurrency(userInfo?.country || COUNTRY)}
            {conCurrency(userInfo?.price || 0, 2)}
          </View>
          <View className="coupons-list-item-title">Avaliable</View>
        </View>
        <View className="coupons-list-box">
          <YButton yType="default" onClick={onGetMore}>
            <View className="coupons-list-box-but">Get More</View>
          </YButton>
        </View>
      </View>

      {/* list */}
      <View style={{ height: windowHeight - 160 }}>
        <YListView
          classStyle="coupons-score"
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
        <View className="coupons-mask">
          <View className="coupons-mask-center">
            <View className="coupons-mask-center-title">
              How to Obtain Coupons
            </View>
            <View className="coupons-mask-center-center">
              Whats Wright Cash Whats Wright Cash Whats Wright Cash Whats Wright
              Cash Whats Wright Cash
            </View>
          </View>
          <Image className={"coupons-mask-image"} src={closeImg} />
        </View>
      </TMask>
    </View>
  );
};

export default Coupons;

/**
 *  @Author: duanruilong
 *  @Date: 2022-05-12 11:44:10
 *  @Desc: item-card
 */

const ItemCard = props => {
  const reasonsPicker = ["Coupons-1", "Coupons-2", "Coupons-3"];
  const { data, userInfo, onUseItNow } = props;
  const [selectorChecked, setSelectorChecked] = useState();

  return (
    <View className="coupons-score-item-center">
      <View className="coupons-score-item-center-left">
        {isCurrency(userInfo?.country || COUNTRY)}
        {conCurrency(data?.price || 0, 2)}
      </View>
      <View className="coupons-score-item-center-right">
        <View className="coupons-score-item-center-right-title">
          <View className="coupons-score-item-center-right-title-text">
            Coupons
          </View>
          <View
            className="coupons-score-item-center-right-title-box"
            onClick={e => {
              if (process.env.TARO_ENV !== "rn") {
                e.stopPropagation();
                onUseItNow({ ...data, selectorChecked: selectorChecked });
              }
            }}
          >
            <YButton
              yType="default"
              onClick={e => {
                if (process.env.TARO_ENV === "rn") {
                  onUseItNow({ ...data, selectorChecked: selectorChecked });
                }
              }}
            >
              <View className="coupons-score-item-center-right-title-box-but">
                Use It Now
              </View>
            </YButton>
          </View>
        </View>
        <View
          className="coupons-score-item-center-right-info"
          numberOfLines={1}
        >
          {data?.title}
        </View>
        <View
          className="coupons-score-item-center-right-info"
          numberOfLines={1}
        >
          Note: oteNoteNoteNoteNototeNoteNoteNoteNote
          {data?.title}
        </View>
        <Picker
          mode="selector"
          range={reasonsPicker}
          onChange={e => {
            setSelectorChecked(reasonsPicker[e.detail.value]);
          }}
        >
          <View className="coupons-score-item-center-right-detail">
            {selectorChecked ? selectorChecked : "Details"}
            <Image
              className={"coupons-score-item-center-right-detail-img"}
              src={left}
            />
          </View>
        </Picker>
      </View>
    </View>
  );
};
