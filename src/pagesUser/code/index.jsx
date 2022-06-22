import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import QR_code from "@/assets/QR_code.png";
import YTitleTask from "@/components/YTitleTask";
import { getStorageData } from "@/utils/utils";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-11 14:11:59  * @Desc: Code  */

const Code = () => {
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
    <View className="user-Qr">
      <YTitleTask
        className="user-Qr-item"
        title="By My Friends"
        showIcon={false}
      />
      <View className={"user-Qr-icon"}>
        <Image className={"user-Qr-icon-img"} src={QR_code} />
      </View>
      <YTitleTask className="user-Qr-item" title="Add With Email" />
    </View>
  );
};

export default Code;
