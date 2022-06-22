import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Input, Text } from "@tarojs/components";
import backImg from "@/assets/left.png";
import { COUNTRY } from "@/constants";
import YListView from "@/components/YListView";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import YButton from "@/components/YButton";
import YTabKind from "@/components/YTabKind";
import { toast } from "@/utils/tools";
import { getStorageData, isCurrency, conCurrency } from "@/utils/utils";
import { getRecommend, getOrders, getGoodsAddCart } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: userGoodsList
 *  Order History 列表
 *  */

const kindData = [
  { title: "all", type: 0 },
  { title: "Pending", type: 1 },
  { title: "Purchased", type: 2 },
  { title: "Shipped", type: 3 },
  { title: "Done", type: 4 }
];

const GoodsList = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const lisGoodsListRef = useRef(null);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();
  const [searchValue, setSearchValue] = useState();
  const [tab, setTab] = useState(0);
  const [dates, setDates] = useState();

  const getUserInfo = () => {
    const data = getStorageData("userInfo");
    current.userData = data;
    setUserInfo(data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // 切换tab
  const onKindTabClick = ({ index, sort }) => {
    console.log("onKindTabClick :>> ", index);
    setTab(index);
    lisGoodsListRef.current && lisGoodsListRef.current.load({ type: index });
  };

  // 跳转商品详情
  const onItemClick = async values => {
    console.log("跳转商品详情 :>> ", values);
    await Taro.setStorage({
      key: "cards_order_data",
      data: { order: values, data: [values] }
    });
    Taro.navigateTo({
      url: `/pagesGoods/order/index?disable=true&orderid=${values.recommendid}`
    });
  };

  // 添加到购物车
  const onGoodsAddCart = values => {
    getGoodsAddCart({
      token: current.infoData.token,
      ...values
    })
      .then(res => {
        toast("Success");
      })
      .catch(() => {});
  };

  const onCancelClick = async (values, type) => {
    console.log(type, "onCancelClick :>> ", values);
    await Taro.setStorage({
      key: "cards_order_data",
      data: { order: values, data: [values] }
    });
    if (type === "Review") {
      Taro.navigateTo({
        url: `/pagesGoods/orderReview/index?type=${type}`
      });
    } else if (type === "Again") {
      onGoodsAddCart({
        buycount: 1, // 添加数量
        goodsId: values?.goodsId,
        sort: 0, //排序
        stockId: 0 //库存id
      });
    } else {
      Taro.navigateTo({
        url: `/pagesGoods/orderReturn/index?type=${type}`
      });
    }
  };

  const onChangeInput = values => {
    console.log("onKindTabClick :>> ", values);
    lisGoodsListRef.current &&
      lisGoodsListRef.current.load({ type: tab, key: values });
    setSearchValue(values);
  };

  const renderList = values => {
    const { data } = values;
    setDates(data);
    console.log("data :>> ", data);
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return (
      <>
        {data.map((item, index) => {
          return (
            <View
              key={item?.icon || index}
              onClick={() => {
                onItemClick(item);
              }}
              className="goods-list-score-cent"
            >
              <YTitleTask
                showIcon={false}
                className="goods-list-score-cent-top"
                title={
                  <View className="goods-list-score-cent-top-center">
                    <View className="goods-list-score-cent-top-center-title">
                      Order ID:
                      <Text className="goods-list-score-cent-top-center-title-text">
                        &nbsp;{item?.recommendid}
                      </Text>
                    </View>
                    <View className="goods-list-score-cent-top-center-title">
                      Order Date:
                      <Text className="goods-list-score-cent-top-center-title-text">
                        &nbsp;{item?.title}
                      </Text>
                    </View>
                  </View>
                }
                right={
                  <View className="goods-list-score-cent-top-right">
                    Pending
                  </View>
                }
              />
              <View className="goods-list-score-cent-item">
                <View className="goods-list-score-cent-item-lf">
                  <View className="goods-list-score-cent-item-lf-title">
                    Order Details
                  </View>
                  <View className="goods-list-score-cent-item-lf-info">
                    Order Total :
                    <Text className="goods-list-score-cent-item-lf-info-text">
                      {isCurrency(userInfo?.country || COUNTRY)}
                      {conCurrency(item?.price || 0, 2)}
                    </Text>
                  </View>
                  <View className="goods-list-score-cent-item-lf-info">
                    Deals Total :
                    <Text className="goods-list-score-cent-item-lf-info-text">
                      {isCurrency(userInfo?.country || COUNTRY)}
                      {conCurrency(item?.price || 0, 2)}
                    </Text>
                  </View>
                  <View className="goods-list-score-cent-item-lf-info">
                    Shipping Total :
                    <Text className="goods-list-score-cent-item-lf-info-text">
                      {isCurrency(userInfo?.country || COUNTRY)}
                      {conCurrency(item?.price || 0, 2)}
                    </Text>
                  </View>
                  <View className="goods-list-score-cent-item-lf-info">
                    Prom Order :
                    <Text className="goods-list-score-cent-item-lf-info-text">
                      {isCurrency(userInfo?.country || COUNTRY)}
                      {conCurrency(item?.price || 0, 2)}
                    </Text>
                  </View>
                </View>
                <View className="goods-list-score-cent-item-rt">
                  <View
                    className="goods-list-score-cent-item-rt-box"
                    onClick={e => {
                      if (process.env.TARO_ENV !== "rn") {
                        e.stopPropagation();
                        onCancelClick(item, "Review");
                      }
                    }}
                  >
                    <YButton
                      yType="default"
                      onStartShouldSetResponderCapture={ev => true}
                      onClick={e => {
                        if (process.env.TARO_ENV === "rn") {
                          onCancelClick(item, "Review");
                        }
                      }}
                    >
                      <Text className="goods-list-score-cent-item-rt-box-but">
                        Review
                      </Text>
                    </YButton>
                  </View>
                  <View
                    className="goods-list-score-cent-item-rt-box"
                    onClick={e => {
                      if (process.env.TARO_ENV !== "rn") {
                        e.stopPropagation();
                        onCancelClick(item, "Return");
                      }
                    }}
                  >
                    <YButton
                      yType="default"
                      onStartShouldSetResponderCapture={ev => true}
                      onClick={e => {
                        if (process.env.TARO_ENV === "rn") {
                          onCancelClick(item, "Return");
                        }
                      }}
                    >
                      <Text className="goods-list-score-cent-item-rt-box-but">
                        Return
                      </Text>
                    </YButton>
                  </View>
                  <View
                    className="goods-list-score-cent-item-rt-box"
                    onClick={e => {
                      if (process.env.TARO_ENV !== "rn") {
                        e.stopPropagation();
                        onCancelClick(item, "Again");
                      }
                    }}
                  >
                    <YButton
                      yType="default"
                      onStartShouldSetResponderCapture={ev => true}
                      onClick={e => {
                        if (process.env.TARO_ENV === "rn") {
                          onCancelClick(item, "Again");
                        }
                      }}
                    >
                      <Text className="goods-list-score-cent-item-rt-box-but">
                        Buy It Again
                      </Text>
                    </YButton>
                  </View>
                </View>
              </View>
              <View className="goods-list-score-cent-ban">
                <Image
                  className={"goods-list-score-cent-ban-img"}
                  src={item?.icon}
                  mode="aspectFit"
                />
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View className="goods-list">
      <View className="goods-list-top">
        <Image
          className="goods-list-top-back"
          onClick={() => {
            Taro.navigateBack();
          }}
          src={backImg}
          mode="aspectFit"
        />
        <View className="goods-list-top-rt">
          <Input
            className="goods-list-top-rt-input"
            placeholder="Please enter"
            value={searchValue || ""}
            onInput={e => {
              onChangeInput(e.detail.value);
            }}
          />
        </View>
        <View></View>
      </View>
      <View className="goods-list-tab">
        {/* tab */}
        <YTabKind
          data={kindData}
          onChange={onKindTabClick}
          showScree={false}
          total={dates ? dates.length : null}
        />
      </View>
      {/* list */}
      <View style={{ height: windowHeight - 108 }}>
        <YListView
          classStyle="goods-list-score"
          renderList={renderList}
          request={getRecommend}
          extraParams={{
            country: COUNTRY,
            kindid: 1,
            type: 1
          }}
          ref={lisGoodsListRef}
        />
      </View>
    </View>
  );
};

export default GoodsList;
