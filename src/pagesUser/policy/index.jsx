import { useRef } from "react";
import { useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-13 11:13:35  * @Desc: policy  */
const Policy = () => {
  const { current } = useRef({
    editorsCtx: [
      { type: "title", value: "Privacy Policy" },
      { type: "time", value: "Last updated: April 192020" },
      {
        type: "info",
        value:
          "Elsevier is committed to maintaining your confidence and trust with respect to your privacy.This privacy policy explains how we collect, use and share your personal information."
      },
      { type: "h1", value: "About our privacy policy" },
      {
        type: "text",
        value: JSON.stringify(
          `This privacy policv applies to our websites, apps and othe services, including programs and events,that refer or link to this privacy pollicy (each,a "Service").This policy may be supplemented by additional privacy statements,terms or notices provided to you. The Elsevier company that owns or administers the Service,as identified therein,is the primary controller of your personal information provided to, or collected by or for, the Service.`
        )
      }
    ]
  });

  useDidShow(() => {});

  return (
    <View className="policy">
      {current.editorsCtx.map((item, index) => {
        if (item.type === "title") {
          return (
            <View key={index} className="policy-title">
              {item.value}
            </View>
          );
        }
        if (
          item.type === "time" ||
          item.type === "info" ||
          item.type === "text"
        ) {
          return (
            <View key={index} className="policy-time">
              {item.value}
            </View>
          );
        }
        if (item.type === "h1") {
          return (
            <View key={index} className="policy-h1">
              {item.value}
            </View>
          );
        }
        return <View key={index}></View>;
      })}
    </View>
  );
};

export default Policy;
