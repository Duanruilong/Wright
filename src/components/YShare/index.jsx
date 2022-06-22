import { useState, useEffect } from "react";
import { View, ScrollView, Image } from "@tarojs/components";
import classnames from "classnames";
import TMask from "@/components/tinker/TMask";
import closeImg from "@/assets/close1.png";
import user from "@/assets/user_img.png";
import userImg from "@/assets/use_img.png";
import userImg1 from "@/assets/use_img1.png";
import userImg2 from "@/assets/use_img2.png";
import facebook from "@/assets/facebook.png";
import google from "@/assets/google.png";
import twitter from "@/assets/twitter.png";
import "./index.scss";

/**
 * YShare
 * @param data: 数据源
 */

const socialData = [
  { title: "FaceBook", icon: facebook },
  { title: "Gmail", icon: google },
  { title: "Twitter", icon: twitter },
  { title: "FaceBook", icon: facebook },
  { title: "FaceBook", icon: facebook },
  { title: "FaceBook", icon: facebook },
  { title: "FaceBook", icon: facebook },
  { title: "FaceBook", icon: facebook }
];

const YShare = props => {
  const { data, onChange, onScreen, showed = false } = props;
  const [show, setShow] = useState(showed);
  const [usersData, setUsersData] = useState(socialData);

  useEffect(() => {
    console.log("YShare :>> ", props);
    setShow(showed);
  }, [showed]);

  const onSocialClick = values => {
    onChange({ type: "social", data: values });
    // setShow(false);
  };
  const onUserClick = values => {
    onChange({ type: "user", data: values });
    // setShow(false);
  };

  return (
    <TMask visible={show}>
      <View className="y-share">
        <View className="y-share-clo">
          <View className="y-share-clo-text">Share</View>
          <Image
            className={"y-share-clo-img"}
            src={closeImg}
            onClick={() => {
              setShow(false);
            }}
          />
        </View>
        <ScrollView
          className="y-share-scroll"
          scrollX // 横向
          showsHorizontalScrollIndicator={false} // 此属性为true的时候，显示一个水平方向的滚动条。
        >
          {socialData &&
            socialData.map((item, index) => {
              return (
                <View
                  className={"y-share-scroll-item"}
                  key={index}
                  onClick={() => {
                    onSocialClick(item);
                  }}
                >
                  <View className="y-share-scroll-item-box">
                    <Image
                      className={"y-share-scroll-item-box-img"}
                      src={item?.icon}
                      // mode="aspectFit"
                      onClick={onScreen}
                    />
                  </View>
                  <View className="y-share-scroll-item-text">{item.title}</View>
                </View>
              );
            })}
        </ScrollView>
        {usersData && (
          <ScrollView
            className="y-share-scroll"
            scrollX // 横向
            showsHorizontalScrollIndicator={false} // 此属性为true的时候，显示一个水平方向的滚动条。
          >
            {usersData.map((item, index) => {
              return (
                <View
                  className={"y-share-scroll-item"}
                  key={index}
                  onClick={() => {
                    onUserClick(item);
                  }}
                >
                  <View className="y-share-scroll-item-box">
                    <Image
                      className={"y-share-scroll-item-box-img"}
                      src={index % 2 === 0 ? userImg : userImg2}
                      // mode="aspectFit"
                      onClick={onScreen}
                    />
                  </View>
                  <View className="y-share-scroll-item-text">{item.title}</View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </TMask>
  );
};

export default YShare;
