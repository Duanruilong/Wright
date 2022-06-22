import { useState, useRef, useEffect } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { COUNTRY, MAP_UNIT } from "@/constants";
import YTitleTask from "@/components/YTitleTask";
import YButton from "@/components/YButton";
import {
  isCurrency,
  conCurrency,
  getStorageData,
  isEmpty
} from "@/utils/utils";
import { toast } from "@/utils/tools";
import {
  getAddress,
  getOrdersDetail,
  getCreate,
  getDeliverTo
} from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-18 10:57:22
 *  @Desc: 购物车-确认订单& order -detail
 *
 *  disable -->  true : 禁用状态，只展示内容，默认为 false
 *
 *   */

const ShowLoading = () => {
  Taro.showToast({
    title: "loading...",
    mask: true,
    icon: "loading",
    duration: 30000
  });
};

const CartOrder = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({
    pn: 1,
    payStatus: false
  });
  const [disable, setDisable] = useState(params?.disable);
  const [orderData, setOrderData] = useState();
  const [data, setData] = useState([]);
  const [useAddress, setUseAddress] = useState();
  const [usePay, setUsePay] = useState();

  const onAddress = (values, type) => {
    if (type === "request") {
      getAddress({
        country: values?.country,
        userid: values?.userid
      }).then(res => {
        const date = res.data;
        setUseAddress(date);
      });
    } else {
      getStorageData("cards_order_address").then(values => {
        setUseAddress(values);
      });
      getStorageData("cards_order_payment").then(values => {
        setUsePay(values);
      });
    }
  };
  // 获取订单详情
  const onOrdersDetail = values => {
    getOrdersDetail({
      country: values?.country,
      orderid: params?.orderid,
      userid: values?.userid
    }).then(res => {
      const date = res.data;
      setOrderData(date || []);
      setData(date || []);
    });
  };

  // 获取配送信息
  const onDeliverTo = values => {
    getDeliverTo({
      // adid:22,
      userid: values?.userid,
      country: values?.country,
      goodsid: params?.orderid
    })
      .then(res => {
        console.log("获取配送信息 :>> ", res.data);
        // const date = res.data;
        // setOrderData(date || []);
        // setData(date || []);
      })
      .catch(() => {});
  };

  // 获取支付信息
  const onOrderPay = values => {
    ShowLoading();

    getDeliverTo({
      // adid:22,
      userid: values?.userid,
      country: values?.country,
      goodsid: params?.orderid
    })
      .then(res => {
        console.log("获取支付信息 :>> ", res.data);
        Taro.hideToast();
        // const date = res.data;
        // setOrderData(date || []);
        // setData(date || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getStorageData("userInfo").then(values => {
      current.infoData = values;
      onAddress(values, "request");
      if (params?.orderid) {
        onOrdersDetail(values);
        onDeliverTo(values);
      }
    });

    getStorageData("cards_order_data").then(values => {
      console.log("cards_order_data :>> ", values);
      setOrderData(values?.order || []);
      setData(values?.data || []);
    });
  }, []);

  useDidShow(() => {
    onAddress(current.infoData, "local");
    // 查询支付状态
    if (current.payStatus) {
      onOrderPay();
    }
  });

  const showDeliver = values => {
    return `${values?.firstname} ${values?.lastname} ${values?.address} ${values?.city} ${values?.state} ${values?.destination} ${values?.postcodes}`;
  };

  const goodsData = value => {
    let newData = [];
    value.forEach(element => {
      newData.push({
        id: element?.recommendid,
        count: element?.num,
        color: element?.color,
        size: element?.size
      });
    });
    return JSON.stringify(newData);
  };

  const onAddCredits = () => {
    console.log(data, "current.selectData :>> ", current);
    ShowLoading();

    getCreate({
      adid: useAddress?.adid, //收货地址id
      // cartIds: useAddress, //购物车ids,用‘，’隔开
      goods: goodsData(data), //购买的商品对象，以json数组字符串格式传输,[{'id':'商品id','count':1,'color':'Black','size':'6.5'}]
      userid: current.infoData?.userid
    })
      .then(res => {
        console.log("res onAddCredits :>> ", res);
        current.payStatus = true;
        Taro.navigateTo({
          url: `/pagesGoods/pay/index?`
        });
      })
      .catch(e => {
        console.log("e :>> ", e);
      });
  };

  // 订单总数
  const onOrderTotal = values => {
    let order = 0;
    if (values) {
      values.forEach(element => {
        order += element.price;
      });
      return ` ${isCurrency(current.infoData?.country)}${conCurrency(
        order,
        2
      )}`;
    }
  };

  // 交易总数
  const onDealsTotal = values => {
    let order = 0;
    if (values) {
      values.forEach(element => {
        order += element.price * element.num;
      });
      return ` ${isCurrency(current.infoData?.country)}${conCurrency(
        order,
        2
      )}`;
    }
  };

  // 邮寄总数
  const onShippTotal = values => {
    let order = 10;
    // values.forEach(element => {
    //   order += element.price;
    // });
    return ` ${isCurrency(current.infoData?.country)}${conCurrency(order, 2)}`;
  };
  // 优惠券总数
  const onCouponsTotal = values => {
    let order = 1230;
    // values.forEach(element => {
    //   order += element.price;
    // });
    return ` ${isCurrency(current.infoData?.country)}${conCurrency(order, 2)}`;
  };
  // 税
  const onTaxTotal = values => {
    let order = 2790;
    // values.forEach(element => {
    //   order += element.price;
    // });
    return ` ${isCurrency(current.infoData?.country)}${conCurrency(order, 2)}`;
  };

  const renderList = () => {
    console.log("data renderList:>> ", data);
    return (
      <>
        {disable && (
          <YTitleTask
            showIcon={false}
            className="cart-order-top"
            title={
              <View className="cart-order-top-center">
                <View className="cart-order-top-center-title">Order ID:</View>
                <View className="cart-order-top-center-text">
                  {orderData?.recommendid}
                </View>
                <View className="cart-order-top-center-title">Order Date:</View>
                <Text className="cart-order-top-center-text">
                  {orderData?.title}
                </Text>
              </View>
            }
            right={<View className="cart-order-top-right">Pending</View>}
          />
        )}
        <YTitleTask
          showIcon={!disable}
          className="cart-order-earn"
          onClick={() => {
            if (!disable) {
              Taro.navigateTo({ url: "/pagesUser/address/index?type=check" });
            }
          }}
          title={
            <View className="cart-order-earn-item">
              <View className="cart-order-earn-item-title">Deliver to</View>
              <View className="cart-order-earn-item-info">
                {useAddress ? showDeliver(useAddress) : "Please enter Address"}
              </View>
            </View>
          }
        />
        {disable && <Track orderData={orderData} />}
        <YTitleTask
          className="cart-order-earn"
          showIcon={!disable}
          onClick={() => {
            if (!disable) {
              Taro.navigateTo({ url: "/pagesUser/payment/index?type=check" });
            }
          }}
          title={
            <View className="cart-order-earn-item">
              <View className="cart-order-earn-item-title">Payment to</View>
              <View className="cart-order-earn-item-info">
                {usePay
                  ? `Credit Card   ${usePay.adid}`
                  : "Please enter Payment"}
              </View>
              <View className="cart-order-earn-item-title">Billing to</View>
              <View className="cart-order-earn-item-info">Credit Card</View>
            </View>
          }
        />
        <YTitleTask
          showIcon={false}
          className="cart-order-earn"
          title="Order Details"
        />
        <View className="cart-order-total">
          <View className="cart-order-total-cen">
            <View className="cart-order-total-cen-tit">ORDER TOTAL</View>
            <View className="cart-order-total-cen-val">
              {onOrderTotal(data)}
            </View>
          </View>
          <View className="cart-order-total-cen">
            <View className="cart-order-total-cen-tit">DEALS TOTAL</View>
            <View className="cart-order-total-cen-val">
              {onDealsTotal(data)}
            </View>
          </View>
          <View className="cart-order-total-cen">
            <View className="cart-order-total-cen-tit">SHIPPING TOTAL</View>
            <View className="cart-order-total-cen-val">
              {onShippTotal(data)}
            </View>
          </View>
          <View className="cart-order-total-cen">
            <View className="cart-order-total-cen-tit">COUPONS TOTAL</View>
            <View className="cart-order-total-cen-val">
              {onCouponsTotal(data)}
            </View>
          </View>
          <View className="cart-order-total-cen">
            <View className="cart-order-total-cen-tit">TAX TOTAL</View>
            <View className="cart-order-total-cen-val">{onTaxTotal(data)}</View>
          </View>
        </View>

        {data.map((item, index) => {
          return (
            <View key={index} className="cart-order-score-item">
              <Image
                className="cart-order-score-item-img"
                src={item?.icon}
                mode="aspectFit"
              />

              <View key={index} className="cart-order-score-item-cent">
                <View
                  className="cart-order-score-item-cent-title"
                  numberOfLines={1}
                >
                  {item?.title}
                </View>
                <View
                  className="cart-order-score-item-cent-descriptor"
                  numberOfLines={1}
                >
                  {item?.descript}
                </View>
                <View className="cart-order-score-item-cent-info">
                  {item?.title}
                </View>
                <View className="cart-order-score-item-cent-inc">
                  <View className="cart-order-score-item-cent-inc-price">
                    {isCurrency(item?.unit)}
                    {conCurrency(item?.price, 2)}
                  </View>
                  <View className="cart-order-score-item-cent-inc-num">
                    x{item?.num || 0}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View className="cart-order">
      {/* list */}
      <ScrollView
        style={{
          height: !disable ? windowHeight - 630 : windowHeight - 60
        }}
        className={`${
          !disable
            ? "cart-order-score"
            : "cart-order-score cart-order-score-dis"
        }`}
        scrollY
        scrollWithAnimation
      >
        {renderList()}
      </ScrollView>
      {/* button */}
      {!disable && (
        <View className="cart-order-but">
          <YButton yType="default" onClick={onAddCredits}>
            <View className="cart-order-but-cent">Check Out</View>
          </YButton>
        </View>
      )}
    </View>
  );
};

export default CartOrder;

const Track = ({ orderData }) => {
  const trackList = [
    { type: "creat", value: "Created" },
    { type: "pur", value: "Purchased" },
    { type: "pro", value: "Processing" },
    { type: "shi", value: "Shipping" },
    { type: "arr", value: "Arrived" }
  ];
  return (
    <View className="cart-order-track">
      <YTitleTask
        showIcon={false}
        onClick={() => {
          // Taro.navigateTo({ url: "/pagesUser/address/index" });
        }}
        title={<View className="cart-order-track-tit">Track</View>}
      />
      {trackList.map((item, index) => {
        return (
          <View key={item.type} className="cart-order-track-list">
            {index > 0 && <View className="cart-order-track-list-lin"></View>}
            <View className="cart-order-track-list-cent">
              <View
                className={`${
                  index < 3
                    ? "cart-order-track-list-cent-ser"
                    : "cart-order-track-list-cent-sered"
                }`}
              >
                {index + 1}
              </View>
              <View className="cart-order-track-list-cent-tit">
                <View className="cart-order-track-list-cent-tit-text">
                  {item.value}
                </View>
                <View className="cart-order-track-list-cent-tit-info">
                  {item.value}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
