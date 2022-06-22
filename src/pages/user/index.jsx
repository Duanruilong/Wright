import { useState, useEffect, useRef } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import user from "@/assets/use_img1.png";
import QR_code from "@/assets/QR_code.png";
import rightImg from "@/assets/right.png";
import YTitleTask from "@/components/YTitleTask";
import { getStorageData, isCurrency, conCurrency } from "@/utils/utils";
import "./index.scss";

const User = () => {
  const { windowHeight } = Taro.getSystemInfoSync();

  const { current } = useRef({ userInfo: null });
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = async () => {
    const data = await getStorageData("userInfo");
    current.userInfo = data;
    setUserInfo(data);
  };

  useEffect(() => {}, []);

  useDidShow(() => {
    // setLocalData(data);
    getUserInfo();
    // 缓存搜索页面返回url
    Taro.setStorage({
      key: "search-from-url",
      data: "/pages/user/index"
    });
  });

  return (
    <View className="user">
      <View className="user-info">
        <View className="user-info-center">
          <View className="user-info-center-top">
            <Image
              className={"user-info-center-top-image"}
              src={user}
              mode="aspectFit"
            />
            <View className="user-info-center-top-item">
              <View
                className="user-info-center-top-item-name"
                numberOfLines={1}
              >
                {userInfo?.nickname || "user"}
              </View>
              <View className="user-info-center-top-item-verified">
                NO Verified
              </View>
            </View>
          </View>
          <View
            className="user-info-code"
            onClick={() => {
              Taro.navigateTo({ url: "/pagesUser/profile/index" });
            }}
          >
            <Image
              className={"user-info-code-image"}
              src={QR_code}
              mode="aspectFit"
            />
            <Image
              className={"user-info-code-icon"}
              src={rightImg}
              mode="aspectFit"
            />
          </View>
        </View>

        <View className="user-info-list">
          <View
            className="user-info-list-item"
            onClick={() => {
              Taro.navigateTo({ url: "/pagesUser/points/index" });
            }}
          >
            <View className="user-info-list-item-name" numberOfLines={1}>
              {userInfo?.point || 0}
            </View>
            <View className="user-info-list-item-title">Point</View>
          </View>
          <View
            className="user-info-list-item"
            onClick={() => {
              Taro.navigateTo({ url: "/pagesUser/cash/index" });
            }}
          >
            <View className="user-info-list-item-name" numberOfLines={1}>
              {`${isCurrency(userInfo?.country)} ${conCurrency(
                userInfo?.cash || 0,
                2
              )}`}
            </View>
            <View className="user-info-list-item-title">Wright Cash</View>
          </View>
          <View
            className="user-info-list-item"
            onClick={() => {
              Taro.navigateTo({ url: "/pagesUser/coupons/index" });
            }}
          >
            <View className="user-info-list-item-name" numberOfLines={1}>
              {userInfo?.coupon || 0}
            </View>
            <View className="user-info-list-item-title">Coupons</View>
          </View>
        </View>
      </View>

      {/* use-list */}
      <ScrollView
        style={{ height: windowHeight - 275 }}
        className="user-list"
        scrollY
        // lowerThreshold={100}
        scrollWithAnimation
        refresherBackground={"#F3F5F8"}
      >
        <YTitleTask
          className="user-list-item"
          title="Order History"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/goodsList/index" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title="Gift Card"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/gift/index" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title="Recently Viewed"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/goodsViewed/index?type=0" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title="Notifications"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/notifications/index" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title="Group Purchase"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/groupPurchase/index" });
          }}
        />
        <View className="user-list-sep" />
        <YTitleTask
          className="user-list-item"
          title="Favorite"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/goodsViewed/index?type=1" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title="Address"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/address/index" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title="Payment"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/payment/index" });
          }}
        />
        <View className="user-list-sep" />
        <YTitleTask
          className="user-list-item"
          title="Setting"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/setting/index" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title="Help"
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/help/index" });
          }}
        />
        <YTitleTask
          className="user-list-item"
          title={`Terms of Use & Privacy Policy`}
          onClick={() => {
            Taro.navigateTo({ url: "/pagesUser/policy/index" });
          }}
        />
      </ScrollView>
    </View>
  );
};

export default User;
