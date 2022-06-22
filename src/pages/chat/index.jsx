import { useState, useRef } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import appendImg from "@/assets/append.png";
import user from "@/assets/use_img1.png";
import mailImg from "@/assets/mail.png";
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

  const renderList = () => {
    if (data.length === 0) {
      return <YNoData desc={"No Chat"} />;
    }
    return (
      <>
        {data.map((item, index) => {
          return (
            <View key={index} className="chat-score-item">
              <YTitleTask
                onClick={() => {
                  Taro.navigateTo({
                    url: `/pagesUser/chatting/index?id=${item.recommendid}`
                  });
                }}
                showIcon={false}
                title={
                  <View className="chat-score-item-lf">
                    <View className="chat-score-item-lf-box">
                      <Image
                        className="chat-score-item-lf-box-img"
                        src={user}
                        mode="aspectFit"
                      />
                    </View>
                    <View className="chat-score-item-lf-cent">
                      <View
                        className="chat-score-item-lf-cent-tit"
                        numberOfLines={2}
                      >
                        {item?.title}
                      </View>
                      <View
                        className="chat-score-item-lf-cent-info"
                        numberOfLines={2}
                      >
                        {item?.descript}
                      </View>
                    </View>
                  </View>
                }
                right={
                  <View className="chat-score-item-rt">
                    <View className="chat-score-item-rt-time">
                      {item?.price}
                    </View>
                    <View className="chat-score-item-rt-num">
                      {item?.star > 98 ? "99+" : item?.star}
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
    <View className="chat">
      <View className="chat-top">
        <Image
          className="chat-top-img"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/contact/index" });
          }}
          src={mailImg}
          mode="aspectFit"
        />
        <View className="chat-top-tit">Recently Chat</View>
        <Image
          className="chat-top-img"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/chatAdd/index" });
          }}
          src={appendImg}
          mode="aspectFit"
        />
      </View>
      <View style={{ height: windowHeight - 114 }}>
        <ScrollView
          className="chat-score"
          scrollY
          lowerThreshold={100}
          scrollWithAnimation
        >
          {renderList()}
        </ScrollView>
      </View>
    </View>
  );
};

export default Chat;
