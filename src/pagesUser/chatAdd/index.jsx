import { useState, useEffect, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import scan_code from "@/assets/scan_code.png";
import QR_code from "@/assets/QR_code.png";
import user from "@/assets/use_img1.png";
import { getStorageData } from "@/utils/utils";
import { toast } from "@/utils/tools";
import { getAddresses } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-29 10:57:04
 *  @Desc: ChatAdd
 *  */

const ChatAdd = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  // const [params] = useState(Current.router.params);
  const { current } = useRef({ userData: {} });
  const [data, setData] = useState([]);

  const getUserInfo = async () => {
    const use = await getStorageData("userInfo");
    current.userData = use;
    getAddresses({
      country: use?.country,
      userid: use?.userid
    }).then(res => {
      setData(res?.data || []);
    });
  };

  useDidShow(() => {
    // 清除临时缓存数据
    Taro.removeStorage({ key: "order_address_item" });
    getUserInfo();
  });

  const onScanClick = async () => {
    //调起客户端扫码
    await Taro.scanCode({
      onlyFromCamera: true
    })
      .then(res => {
        console.log("调起客户端扫码", res);
      })
      .catch(() => {});
  };

  const renderList = () => {
    if (data.length === 0) {
      return <YNoData desc={"No data"} />;
    }
    return data.map((item, index) => {
      return (
        <View key={item?.icon || index} className="add-new-score-item">
          <YTitleTask
            showIcon={false}
            title={
              <View className="add-new-score-item-lf">
                <View className="add-new-score-item-lf-box">
                  <Image
                    className="add-new-score-item-lf-box-img"
                    onClick={() => {
                      Taro.navigateBack();
                    }}
                    src={user}
                    mode="aspectFit"
                  />
                </View>
                <View className="add-new-score-item-lf-cent">
                  <View
                    className="add-new-score-item-lf-cent-tit"
                    numberOfLines={2}
                  >
                    {item?.title}
                  </View>
                  <View
                    className="add-new-score-item-lf-cent-info"
                    numberOfLines={2}
                  >
                    {item?.destination}
                  </View>
                </View>
              </View>
            }
            right={
              <View
                className="add-new-score-item-rt"
                onClick={() => {
                  Taro.navigateTo({ url: "/pagesUser/chatExam/index" });
                }}
              >
                Add
              </View>
            }
          />
        </View>
      );
    });
  };

  return (
    <View className="add-new">
      <View className="add-new-top">
        <YTitleTask
          className="add-new-top-list"
          title="My QR"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/code/index" });
          }}
          right={<Image className="add-new-top-list-item" src={QR_code} />}
        />
        <YTitleTask
          className="add-new-top-list"
          title="SCAN"
          onClick={() => {
            onScanClick();
          }}
          right={<Image className="add-new-top-list-item" src={scan_code} />}
        />
        <View className="add-new-top-title">YOU MIGHT KNOW</View>
      </View>
      {/* list */}
      <ScrollView
        style={{
          height: windowHeight - 400
        }}
        classStyle="add-new-score"
        scrollY
        scrollWithAnimation
      >
        {renderList()}
      </ScrollView>
    </View>
  );
};

export default ChatAdd;
