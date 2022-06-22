import { useState, useEffect, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import editImg from "@/assets/edit.png";
import delImg from "@/assets/del1.png";
import { getStorageData } from "@/utils/utils";
import { toast } from "@/utils/tools";
import { getAddresses } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: Payment
 *  */

const Payment = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);

  const { current } = useRef({
    userData: {}
  });
  const [data, setData] = useState([]);
  const [touchIndex, setTouchIndex] = useState();
  let timer;

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
    Taro.removeStorage({
      key: "order_address_item"
    });
    getUserInfo();
  });
  // useEffect(() => {
  //   getUserInfo();
  // }, []);

  // 点击Item
  const onItemClick = item => async () => {
    console.log(params.type, "onItemClick :>> ", item);
    setTouchIndex(null);
    if (params.type === "check") {
      // 购物车过来选择
      await Taro.setStorage({
        key: "cards_order_payment",
        data: item
      });

      setTimeout(
        () => {
          Taro.navigateBack();
        },

        1000
      );
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
      url: "/pagesUser/paymentEdit/index?type=edit"
    });
  };

  const getPayCard = values => {
    return `${values.slice(0, 4)}  ********${values.slice(-4)} `;
  };

  // 长按事件
  const handleTouchEnd = () => {
    clearTimeout(timer);
  };

  const touchStart = index => {
    console.log("你要do的事 :>> ", index);

    timer = setTimeout(
      () => {
        //  你要do的事
        console.log("你要do的事 :>> ", 2222222);
        setTouchIndex(index);
      },

      800
    );
  };

  const onItemDetailClick = values => {
    console.log("onItemDetailClick 删除:>> ", values);
    toast("删除");
    setTouchIndex(null);
  };

  const renderList = () => {
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }

    return data.map((item, index) => {
      return (
        <View key={item?.icon || index} className="payment-score-item">
          <YTitleTask
            showIcon={false}
            // className="payment-score-item"
            title={
              <View
                className="payment-score-item-center"
                onClick={onItemClick(item)}
                onTouchStart={() => {
                  touchStart(index);
                }}
                onTouchEnd={() => {
                  handleTouchEnd();
                }}
              >
                <View className="payment-score-item-center-title">
                  {item?.title}
                  {`${item?.isdefault === 1 ? "(Dafault)" : ""}

              `}
                </View>
                <View
                  className="payment-score-item-center-time"
                  numberOfLines={2}
                >
                  {getPayCard(item?.adid)}
                </View>
              </View>
            }
            right={
              <Image
                className="payment-score-item-rt"
                src={editImg}
                onClick={onItemEditClick(item)}
                mode="aspectFit"
              />
            }
          />
          {/* 操作 */}
          {touchIndex === index && (
            <View
              className="payment-score-item-touch"
              onClick={() => {
                toast("关闭");
                setTouchIndex(null);
              }}
            >
              <View className="payment-score-item-touch-but">
                <Image
                  className="payment-score-item-touch-but-img"
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
    <View className="payment">
      <YTitleTask
        showIcon={false}
        className="payment-but"
        title="Add New Payment"
        onClick={() => {
          Taro.navigateTo({
            url: "/pagesUser/paymentEdit/index"
          });
        }}
        right={<View className="payment-but-item">+</View>}
      />
      <ScrollView
        style={{
          height: windowHeight - 400
        }}
        classStyle="payment-score"
        scrollY
        scrollWithAnimation
      >
        {renderList()}
      </ScrollView>
    </View>
  );
};

export default Payment;
