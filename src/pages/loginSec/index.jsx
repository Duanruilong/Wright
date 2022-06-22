/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import Taro, { useDidShow, Current } from "@tarojs/taro";
import { View, Image, Text, Input } from "@tarojs/components";
import YButton from "@/components/YButton";
import YTitleTask from "@/components/YTitleTask";
import YInput from "@/components/YInput";
import YSafeAreaView from "@/components/YSafeAreaView";
import logo from "@/assets/logo.png";
import twitterImg from "@/assets/twitter.png";
import googleImg from "@/assets/google.png";
import facebookImg from "@/assets/facebook.png";
import { toast } from "@/utils/tools";
import selectNo from "@/assets/select_no.png";
import selectItem from "@/assets/select_yes.png";
import { COUNTRY, LOGIN_CHANNEL, ENV } from "@/constants";
import { loginHandler } from "@/utils/loginHandler";
import { isEmail } from "@/utils/utils";
import { getRegister, login } from "./service";
import "./index.scss";

const statusSign = {
  in: "Log in",
  up: "Sign Up"
};
const logWith = [
  {
    logo: googleImg,
    name: "Google",
    url: "face-book"
  },
  {
    logo: facebookImg,
    name: "Facebook",
    url: "face-book"
  },
  {
    logo: twitterImg,
    name: "Twitter",
    url: "face-book"
  }
];

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-26 09:42:23
 *  @Desc: 登陆注册页
 * */
const LoginSec = () => {
  const [params] = useState(Current.router.params);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (params?.type) {
      // Taro.setNavigationBarTitle({
      //   title: statusSign[params?.type]
      // });
    }
  }, []);

  const onLogWithChange = value => {
    console.log("value :>> ", value);
    // Taro.navigateTo({ url: "/pagesWork/loginByPassword/index" });
  };

  const onTipClick = type => {
    Taro.navigateTo({ url: "/pages/editor/index" });
  };

  return (
    <YSafeAreaView className="login-sec">
      <View className={"login-sec-tit"}>{statusSign[params?.type]}</View>
      {params?.type === "in" && <LogIn check={check} />}
      {params?.type === "up" && <SignUp check={check} />}
      <View className={"login-sec-tips"}>
        <View
          onClick={e => {
            setCheck(!check);
          }}
          onStartShouldSetResponderCapture={ev => true}
        >
          <Image
            className="login-sec-tips-radio"
            mode="aspectFit"
            src={check ? selectItem : selectNo}
          />
        </View>
        <View className={"login-sec-tips-item"}>
          By tapping "Log In",you agree to the{" "}
          <Text className={"login-sec-tips-item-active"} onClick={onTipClick}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text className={"login-sec-tips-item-active"} onClick={onTipClick}>
            Privacy Policy
          </Text>
        </View>
      </View>
      <View className="login-sec-other">
        {logWith.map((item, index) => {
          return (
            <View className="login-sec-other-cen" key={index}>
              <YButton
                yType="grey"
                onClick={() => {
                  onLogWithChange(item);
                }}
              >
                <View className="login-sec-other-cen-but">
                  <Image
                    className="login-sec-other-cen-but-img"
                    mode="aspectFit"
                    src={item?.logo}
                  />
                  <Text className="login-sec-other-cen-but-text">
                    {item?.name}
                  </Text>
                </View>
              </YButton>
            </View>
          );
        })}
      </View>
    </YSafeAreaView>
  );
};

export default LoginSec;

/**
 * @Author: duanruilong
 * @Date: 2022-04-26 10:30:14
 * * @Desc: 登陆
 * */
const LogIn = ({ check }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const onForget = () => {
    Taro.navigateTo({ url: "/pagesUser/updatePassword/index" });
  };

  const onLog = async () => {
    if (!email) {
      return toast("Please enter Email");
    }
    if (!isEmail(email)) {
      return toast("Please enter Correct Email");
    }
    if (!password) {
      return toast("Please enter Password");
    }
    if (!check) {
      return toast(
        "Please read and agree to the legal statement and privacy policy"
      );
    }
    await login({
      country: COUNTRY,
      loginname: email,
      password
    })
      .then(res => {
        Taro.setStorage({
          key: LOGIN_CHANNEL,
          data: "password"
        });
        loginHandler({ ...res });
      })
      .catch(() => {});
  };

  return (
    <>
      <View className="login-sec-center">
        <YTitleTask showIcon={false} title="Email" />
        <Input
          className="login-sec-center-input"
          name={"email"}
          placeholder="Input You Email"
          type="text"
          value={email}
          onInput={e => {
            setEmail(e.detail.value);
          }}
        />
        <YTitleTask showIcon={false} title="Password" />
        <Input
          className="login-sec-center-input"
          type="password"
          password
          placeholder="Input You Password"
          value={password}
          onInput={e => {
            setPassword(e.detail.value);
          }}
        />
        <View className="login-sec-center-forget" onClick={onForget}>
          Forget Password
        </View>
        <View className="login-sec-center-button">
          <YButton
            yType="default"
            onClick={() => {
              onLog();
            }}
          >
            <View className="login-sec-center-button-text">Log In</View>
          </YButton>
        </View>
      </View>
    </>
  );
};
/**
 * @Author: duanruilong
 * @Date: 2022-04-26 10:30:14
 * * @Desc: 注册
 * */
const SignUp = ({ check }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onSign = async () => {
    if (!name) {
      return toast("Please enter Nickname");
    }

    if (!email) {
      return toast("Please enter Email");
    }
    if (!isEmail(email)) {
      return toast("Please enter Correct Email");
    }
    if (!password) {
      return toast("Please enter Password");
    }
    if (password.length < 8) {
      return toast("The password must be at least 8 digits long");
    }
    if (!check) {
      return toast(
        "Please read and agree to the legal statement and privacy policy"
      );
    }
    await getRegister({
      country: COUNTRY,
      nickname: name,
      loginname: email,
      password
    })
      .then(res => {
        Taro.setStorage({
          key: LOGIN_CHANNEL,
          data: "password"
        });
        loginHandler({ ...res });
      })
      .catch(() => {});
  };
  return (
    <>
      <View className="login-sec-center">
        <YTitleTask showIcon={false} title="Name" />
        <Input
          className="login-sec-center-input"
          name={"nickname"}
          placeholder="Input You Nickname"
          type="text"
          value={name}
          onInput={e => {
            setName(e.detail.value);
          }}
        />
        <YTitleTask showIcon={false} title="Email" />
        <Input
          className="login-sec-center-input"
          name={"email"}
          placeholder="Input You Email"
          type="text"
          value={email}
          onInput={e => {
            setEmail(e.detail.value);
          }}
        />
        <YTitleTask showIcon={false} title="Password" />
        <Input
          className="login-sec-center-input"
          placeholder="Input You Password"
          type="password"
          password
          value={password}
          onInput={e => {
            setPassword(e.detail.value);
          }}
        />
        <View className="login-sec-center-box"></View>
        <View className="login-sec-center-button">
          <YButton
            yType="default"
            onClick={() => {
              onSign();
            }}
          >
            <View className="login-sec-center-button-text">Sign Up</View>
          </YButton>
        </View>
      </View>
    </>
  );
};
