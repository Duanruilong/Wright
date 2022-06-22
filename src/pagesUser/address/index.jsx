import { useState, useEffect, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import editImg from "@/assets/edit.png";
import delImg from "@/assets/del1.png";
import { getStorageData } from "@/utils/utils";
import { toast } from "@/utils/tools";
import { getAddresses, getDelAddress } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: address
 *  */

const Address = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userData: {} });
  const [data, setData] = useState([]);
  const [touchIndex, setTouchIndex] = useState();
  let timer;

  const getUserInfo = async () => {
    const use = await getStorageData("userInfo");
    current.userData = use;
    onAddress(use);
  };

  const onAddress = values => {
    getAddresses({
      country: values?.country,
      userid: values?.userid
    }).then(res => {
      setData(res?.data || []);
    });
  };

  useDidShow(() => {
    // 清除临时缓存数据
    Taro.removeStorage({ key: "order_address_item" });
    getUserInfo();
  });
  // useEffect(() => {
  //   getUserInfo();
  // }, []);

  // 点击地址
  const onItemClick = item => async () => {
    console.log(params.type, "onItemClick :>> ", item);
    setTouchIndex(null);
    if (params.type === "check") {
      // 购物车过来选择地址
      await Taro.setStorage({
        key: "cards_order_address",
        data: item
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    }
  };

  // 修改地址
  const onItemEditClick = item => async () => {
    // 修改地址
    await Taro.setStorage({
      key: "order_address_item",
      data: item
    });
    Taro.navigateTo({
      url: "/pagesUser/addressEdit/index?type=edit"
    });
  };

  // 长按事件
  const handleTouchEnd = () => {
    clearTimeout(timer);
  };

  const touchStart = index => {
    timer = setTimeout(() => {
      //  你要do的事
      setTouchIndex(index);
    }, 800);
  };

  const onItemDetailClick = values => {
    console.log("object :>> ", values);
    setTouchIndex(null);
    getDelAddress({
      adid: values?.adid,
      country: current.userData?.country,
      userid: current.userData?.userid
    }).then(res => {
      toast("Success");
      onAddress(current.userData);
    });
  };

  const renderList = () => {
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return data.map((item, index) => {
      return (
        <View key={item?.icon || index} className="address-score-item">
          <YTitleTask
            showIcon={false}
            title={
              <View
                className="address-score-item-center"
                onClick={onItemClick(item)}
                onTouchStart={() => {
                  touchStart(index);
                }}
                onTouchEnd={() => {
                  handleTouchEnd();
                }}
              >
                <View className="address-score-item-center-title">
                  {item?.title}
                  {`${item?.isdefault === 1 ? "(Dafault)" : ""}`}
                </View>
                <View
                  className="address-score-item-center-time"
                  numberOfLines={2}
                >
                  {item?.firstname}&nbsp;{item?.lastname}&nbsp;{item?.phone}
                  &nbsp;
                  {item?.address}&nbsp;{item?.city}&nbsp;{item?.state}&nbsp;
                  {item?.postcodes}
                </View>
              </View>
            }
            right={
              <Image
                className="address-score-item-rt"
                src={editImg}
                onClick={onItemEditClick(item)}
                mode="aspectFit"
              />
            }
          />
          {/* 操作 */}
          {touchIndex === index && (
            <View
              className="address-score-item-touch"
              onClick={() => {
                toast("关闭");
                setTouchIndex(null);
              }}
            >
              <View className="address-score-item-touch-but">
                <Image
                  className="address-score-item-touch-but-img"
                  src={delImg}
                  onClick={() => {
                    onItemDetailClick(item);
                  }}
                  mode="aspectFit"
                />
              </View>
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <View className="address">
      <YTitleTask
        showIcon={false}
        className="address-but"
        title="Add New Address"
        onClick={() => {
          Taro.navigateTo({ url: "/pagesUser/addressEdit/index" });
        }}
        right={<View className="address-but-item">+</View>}
      />
      <ScrollView
        style={{
          height: windowHeight - 400
        }}
        classStyle="address-score"
        scrollY
        scrollWithAnimation
      >
        {renderList()}
      </ScrollView>
    </View>
  );
};

export default Address;
