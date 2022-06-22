import { useState, useRef } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import classnames from "classnames";
import appendImg from "@/assets/append.png";
import user from "@/assets/use_img1.png";
import imgClose from "@/assets/close1.png";
import YNoData from "@/components/YNoData";
import YTitleTask from "@/components/YTitleTask";
import { getStorageData } from "@/utils/utils";

import { getRecommend } from "./service";
import "./index.scss";

const Chat = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const { current } = useRef({ userData: {} });
  const [data, setData] = useState([]);

  const getUserInfo = async () => {
    const use = await getStorageData("userInfo");
    current.userData = use;
    getRecommend({
      country: use?.country,
      kindid: 1,
      type: 1
    }).then(res => {
      setData(res?.data || []);
    });
  };

  useDidShow(() => {
    getUserInfo();
  });

  const onItemAccept = values => {
    console.log("onItemAccept :>> ", values);
  };

  const renderList = () => {
    if (data.length === 0) {
      return <YNoData desc={"No Chat"} />;
    }
    return (
      <>
        {data.map((item, index) => {
          return (
            <View
              key={index}
              onClick={() => {
                // onItemGoods(item);
              }}
              className="chat-ex-score-item"
            >
              <YTitleTask
                showIcon={false}
                title={
                  <View className="chat-ex-score-item-lf">
                    <View className="chat-ex-score-item-lf-box">
                      <Image
                        className="chat-ex-score-item-lf-box-img"
                        onClick={() => {
                          Taro.navigateBack();
                        }}
                        src={user}
                        mode="aspectFit"
                      />
                    </View>
                    <View className="chat-ex-score-item-lf-cent">
                      <View
                        className="chat-ex-score-item-lf-cent-tit"
                        numberOfLines={2}
                      >
                        {item?.title}
                      </View>
                      <View
                        className="chat-ex-score-item-lf-cent-info"
                        numberOfLines={2}
                      >
                        {item?.descript}
                      </View>
                    </View>
                  </View>
                }
                right={
                  <View className="chat-ex-score-item-rt">
                    <View className="chat-ex-score-item-rt-time">
                      {item?.title}
                    </View>
                    <View
                      onClick={() => {
                        onItemAccept(item);
                      }}
                      className={classnames("chat-ex-score-item-rt-but", {
                        "chat-ex-score-item-rt-but-dis": index > 2
                      })}
                    >
                      {index < 2 ? "Accept" : "Expired"}
                    </View>
                  </View>
                }
              />
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View className="chat-ex">
      <View className="chat-ex-top">
        <Image
          className="chat-ex-top-image"
          onClick={() => {
            Taro.navigateBack();
          }}
          src={imgClose}
          mode="aspectFit"
        />
        <View className="chat-ex-top-tit">Friend Application</View>
        <Image
          className="chat-ex-top-img"
          onClick={() => {
            Taro.navigateBack();
          }}
          src={appendImg}
          mode="aspectFit"
        />
      </View>
      <ScrollView
        style={{ height: windowHeight - 106 }}
        className="chat-ex-score"
        scrollY
        lowerThreshold={100}
        scrollWithAnimation
      >
        {renderList()}
      </ScrollView>
    </View>
  );
};

export default Chat;
