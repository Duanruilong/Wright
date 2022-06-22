/* eslint-disable react/no-unused-state */
import { Component } from "react";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import { View, Text, Input } from "@tarojs/components";
import YPasswordInput from "@/components/YPasswordInput";
import YInput from "@/components/YInput";
import YTitleTask from "@/components/YTitleTask";
import YButton from "@/components/YButton";
import { LOGIN_CHANNEL } from "@/constants";
import { loginHandler } from "@/utils/loginHandler";
import { toast } from "@/utils/tools";
import { isString, isEmail } from "@/utils/utils";

import {
  sendVerifyCodeByEmail,
  sendVerifyCodeByMsg,
  changePwd
} from "./service";
import "./index.scss";

const maxCount = 61;
const inputText = { 0: "Email", 1: "Phone" };

/**
 * @Author: duanruilong
 * @Date: 2022-04-26 11:49:44
 * @Desc: Reset Password
 *  */

class Password extends Component {
  state = {
    email: null,
    code: null,
    newPassword: null,
    confirmPassword: null,
    count: maxCount,
    selected: 0
  };

  // eslint-disable-next-line react/sort-comp
  timer = null;

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  onYzmClick = () => {
    const { count, email, selected } = this.state;

    if (!email) {
      return toast(`Please enter ${inputText[selected]}`);
    }

    if (count < maxCount) {
      return;
    }

    this.setState({ count: count - 1 });
    this.timer = setInterval(() => {
      const { count } = this.state;
      if (count <= 1) {
        this.setState({ count: maxCount });
        clearInterval(this.timer);
      } else {
        this.setState({ count: count - 1 });
      }
    }, 1000);
    // 发送验证码
    if (selected === 0) {
      sendVerifyCodeByEmail({ email }).catch(() => {
        this.setState({ count: maxCount });
        clearInterval(this.timer);
      });
    } else {
      sendVerifyCodeByMsg({ mobilePhone: email }).catch(() => {
        this.setState({ count: maxCount });
        clearInterval(this.timer);
      });
    }
  };

  onSubmit = async () => {
    const { code, email, confirmPassword, selected } = this.state;
    console.log("onSubmit :>> ", this.state);

    if (!email) {
      return toast(`Please enter ${inputText[selected]}`);
    }
    if (isEmail(email)) {
      return toast(`Please enter Correct  ${inputText[selected]}`);
    }
    if (!code) {
      return toast("Please enter Code");
    }
    if (!confirmPassword) {
      return toast("Please enter New Password");
    }

    changePwd({
      loginname: email,
      verifyCode: code,
      pwd: confirmPassword
    }).then(res => {
      Taro.setStorage({
        key: LOGIN_CHANNEL,
        data: "code"
      });
      toast("Password modified successfully");
      setTimeout(() => {
        loginHandler(res);
      }, 2000);
    });
  };
  render() {
    const { code, count, selected } = this.state;
    return (
      <View className="reset-password">
        <View className="reset-password-cen">
          <YTitleTask
            showIcon={false}
            title="Email Or Phone No."
            right={
              <View className="reset-password-cen-item">
                <View
                  className={classnames("reset-password-cen-item-lf", {
                    "reset-password-cen-item-active": selected === 0
                  })}
                  onClick={() => {
                    this.setState({ selected: 0 });
                  }}
                >
                  Email
                </View>
                <View
                  className={classnames("reset-password-cen-item-rt", {
                    "reset-password-cen-item-active": selected === 1
                  })}
                  onClick={() => {
                    this.setState({ selected: 1 });
                  }}
                >
                  Phone
                </View>
              </View>
            }
          />

          <View className="reset-password-cen-shell">
            <View className="reset-password-cen-shell-cen">
              <Input
                className="reset-password-cen-shell-cen-input"
                name={"number"}
                placeholder={`Input ${inputText[selected]}`}
                onInput={e => {
                  this.setState({ email: e.detail.value });
                }}
              />
            </View>
          </View>
          <View className="reset-password-cen-box"></View>
          <YTitleTask showIcon={false} title="Reset Code" />
          <View className="reset-password-cen-shell">
            <View className="reset-password-cen-shell-cen">
              <YInput
                className="reset-password-cen-shell-cen-input"
                name={"code"}
                type="number"
                placeholder="Input Reset Code"
                // maxlength={4}
                value={code}
                onInput={data => {
                  this.setState({ code: data.detail.value });
                }}
                right={
                  <View className={"reset-password-cen-code"}>
                    <Text
                      className={`${
                        count < maxCount
                          ? "reset-password-cen-code-disabled"
                          : "reset-password-cen-code-active"
                      }`}
                      onClick={this.onYzmClick}
                    >
                      {count < maxCount ? `${count}s ` : "Send "}
                    </Text>
                  </View>
                }
              />
            </View>
          </View>
          <View className="reset-password-cen-box"></View>
          <YTitleTask showIcon={false} title="New Password" />
          <View className="reset-password-cen-shell">
            <View className="reset-password-cen-shell-cen">
              <YPasswordInput
                className="reset-password-cen-shell-cen-input"
                name={"confirmPassword"}
                placeholder="Input New Password"
                onChange={data => {
                  if (isString(data)) {
                    this.setState({ confirmPassword: data });
                  }
                }}
              />
            </View>
          </View>
        </View>
        {/* but */}
        <View className="reset-password-but">
          <YButton
            yType="default"
            onClick={() => {
              this.onSubmit();
            }}
          >
            <View className="reset-password-but-text">Reset Password</View>
          </YButton>
        </View>
      </View>
    );
  }
}

export default Password;
