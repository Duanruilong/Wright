import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import YTitleTask from "@/components/YTitleTask";
import { getStorageData } from "@/utils/utils";
import { loginOutHandler } from "@/utils/loginHandler";
import { getRecommend } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: Setting
 *  */

const Setting = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const lisPointsRef = useRef(null);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = () => {
    const data = getStorageData("userInfo");
    current.userData = data;
    setUserInfo(data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View className="setting">
      <YTitleTask
        className="setting-item"
        title="Region & Language"
        onClick={() => {
          Taro.navigateTo({ url: "/pagesUser/settingSec/index?type=r" });
        }}
      />
      <YTitleTask
        className="setting-item"
        title="Notification"
        onClick={() => {
          Taro.navigateTo({ url: "/pagesUser/settingSec/index?type=n" });
        }}
      />
      <YTitleTask
        className="setting-item"
        title="Reset Password"
        onClick={() => {
          Taro.navigateTo({ url: "/pagesUser/settingSec/index?type=p" });
        }}
      />
      <YTitleTask
        className="setting-item"
        showIcon={false}
        title="Log out"
        onClick={() => {
          loginOutHandler();
        }}
      />
    </View>
  );
};

export default Setting;
