import { useState, useEffect, useRef } from "react";
import Taro, { Current } from "@tarojs/taro";
import { View, Image, ScrollView, Input, Textarea } from "@tarojs/components";
import closeImg from "@/assets/close_2.png";
import { COUNTRY } from "@/constants";
import YButton from "@/components/YButton";
import YTitleTask from "@/components/YTitleTask";
import YInputSearch from "@/components/YInputSearch";
import TMask from "@/components/tinker/TMask";
import cameraImg from "@/assets/camera.png";
import { getStorageData } from "@/utils/utils";
import { toast } from "@/utils/tools";
import { getRecommend } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: HelpSec
 *  */

const HelpSec = () => {
  const [params] = useState(Current.router.params);
  const lisPointsRef = useRef(null);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = () => {
    const data = getStorageData("userInfo");
    current.userData = data;
    setUserInfo(data);
  };

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: params?.type === "q" ? "FAQ" : "Feedback & Complaint"
    });
    getUserInfo();
  }, []);

  return (
    <View className="help-sec">
      {params?.type === "q" && <Faq userInfo={userInfo} />}
      {params?.type === "f" && <Feedback userInfo={userInfo} />}
    </View>
  );
};

export default HelpSec;

/**  * @Author: duanruilong  * @Date: 2022-04-24 15:06:38  * @Desc: Faq  */
const Faq = ({ userInfo }) => {
  console.log("userInfo :>> ", userInfo);
  const makData = [
    {
      key: "point",
      title: "What's points ?",
      info: "pointspointspointspointspointspointspointspoints"
    },
    {
      key: "cash",
      title: "What's Wright Cash ?",
      info: "CashCashCashCashCashCashCashCashCashCashCashCashCash"
    },
    {
      key: "coupons",
      title: "What's Coupons ?",
      info: "CouponsCouponsCouponsCouponsCouponsCouponsCouponsCouponsCoupons"
    },
    {
      key: "to_point",
      title: "How to Earn Points ?",
      info: "CouponsCouponsCouponsCouponsCouponsCouponsCouponsCouponsCoupons"
    }
  ];
  const { windowHeight } = Taro.getSystemInfoSync();
  const [show, setShow] = useState(false);

  const [maskData, setMaskData] = useState();

  useEffect(() => {}, [userInfo]);

  const onChange = values => {
    console.log("onChange :>> ", values);
  };

  const onClearClick = values => {
    console.log("onClearClick :>> ", values);
  };

  const onConfirmChange = values => {
    console.log("onConfirmChange :>> ", values);
  };

  return (
    <>
      <View className="help-sec-fqa">
        <View className="help-sec-fqa-top">
          <YInputSearch
            className={"help-sec-fqa-top-input"}
            placeholder={"Search"}
            onClearClick={onClearClick}
            onConfirm={onConfirmChange}
            onChange={onChange}
            // initialValue={current.local}
          />
        </View>
        <ScrollView
          style={{
            height: windowHeight - 140
          }}
          className="help-sec-fqa-score"
          scrollY
          scrollWithAnimation
        >
          <YTitleTask className="help-sec-fqa-score-item" title="Account" />
          <YTitleTask className="help-sec-fqa-score-item" title="Orders" />
          <YTitleTask
            className="help-sec-fqa-score-item"
            showIcon={false}
            title={
              <View className="help-sec-fqa-score-item-rew">
                <View className="help-sec-fqa-score-item-rew-tit">Rewards</View>
                {makData.map(item => {
                  return (
                    <View
                      key={item.title}
                      onClick={() => {
                        setMaskData(item);
                        setShow(!show);
                      }}
                      className="help-sec-fqa-score-item-rew-text"
                    >
                      {item.title}
                    </View>
                  );
                })}
              </View>
            }
          />
        </ScrollView>
        {/* TMask */}
        <TMask visible={show}>
          <View className="help-sec-fqa-mask">
            <View className="help-sec-fqa-mask-center">
              <View className="help-sec-fqa-mask-center-title">
                {maskData?.title}
              </View>
              <View className="help-sec-fqa-mask-center-info">
                {maskData?.info}
              </View>
            </View>
            <Image
              onClick={() => {
                setShow(false);
              }}
              src={closeImg}
              className="help-sec-fqa-mask-image"
            />
          </View>
        </TMask>
      </View>
    </>
  );
};

/**  * @Author: duanruilong  * @Date: 2022-04-24 17:41:13  * @Desc: Feedback  */
const Feedback = () => {
  const { current } = useRef({ returnText: "" });
  const [feedData, setFeedData] = useState();

  const onSubmit = () => {
    console.log("onSubmit :>> ", feedData, current);
  };
  return (
    <View className="help-sec-feed">
      <View className="help-sec-feed-cent">
        <YTitleTask
          className="help-sec-feed-cent-item"
          title="Title"
          showIcon={false}
          right={
            <Input
              className="help-sec-feed-cent-item-input"
              placeholder="Please enter Post Codes"
              type="number"
              value={feedData?.title || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...feedData };
                newArr.title = values;
                setFeedData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="help-sec-feed-cent-area"
          title="Description "
          showIcon={false}
          right={
            <Image
              onClick={() => {}}
              className="help-sec-feed-cent-area-img"
              src={cameraImg}
              mode="aspectFit"
            />
          }
        />
        <View className="help-sec-feed-cent-textarea">
          <Textarea
            className="help-sec-feed-cent-textarea-item"
            maxlength={200}
            onInput={e => {
              console.log("e :>> ", e.detail?.value);
              current.returnText = e.detail?.value;
            }}
            onConfirm={e => {
              console.log("e onConfirm:>> ", e);
            }}
          />
        </View>
      </View>

      {/* button */}
      <View className="help-sec-feed-but">
        <YButton
          yType="default"
          onClick={() => {
            onSubmit();
          }}
        >
          <View className="help-sec-feed-but-cent">Done</View>
        </YButton>
      </View>
    </View>
  );
};
