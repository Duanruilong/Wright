/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import YButton from "@/components/YButton";
import YSafeAreaView from "@/components/YSafeAreaView";
import { loginHandler } from "@/utils/loginHandler";
import { COUNTRY, LOGIN_CHANNEL, ENV } from "@/constants";
import logo from "@/assets/logo.png";
import { getVisitorLog } from "./service";
import "./index.scss";

const Login = () => {
  const { current } = useRef({ system: {} });

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        console.log("getSystemInfo :>> ", res);
        current.system = { ...res };
      }
    });
  }, []);

  const VisitorLog = async () => {
    console.log("current.system :>> ", current.system);
    await getVisitorLog({
      country: COUNTRY,
      machineCode: current.system?.model
    })
      .then(res => {
        console.log("res getVisitorLog:>> ", res);
        Taro.setStorage({
          key: LOGIN_CHANNEL,
          data: "password"
        });
        loginHandler({ ...res });
      })
      .catch(() => {});
  };
  return (
    <YSafeAreaView className="login">
      <Image className={"login-logo"} src={logo} mode="aspectFit" />

      <View className={"login-button"}>
        <View className="login-button-but">
          <YButton
            yType="default"
            onClick={() => {
              Taro.navigateTo({ url: "/pages/loginSec/index?type=in" });
            }}
          >
            <View className="login-button-but-text">Lon-In You Wright</View>
          </YButton>
        </View>
        <View className="login-button-but">
          <YButton
            yType="default"
            onClick={() => {
              Taro.navigateTo({ url: "/pages/loginSec/index?type=up" });
            }}
          >
            <View className="login-button-but-text">
              Create A Wright Account
            </View>
          </YButton>
        </View>
        <View className="login-button-but">
          <YButton
            yType="grey"
            onClick={() => {
              VisitorLog();
            }}
          >
            <View className="login-button-but-text">SKIP</View>
          </YButton>
        </View>
      </View>
    </YSafeAreaView>
  );
};

export default Login;
