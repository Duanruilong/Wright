import { useState, useEffect, useRef } from "react";
import Taro, { Current } from "@tarojs/taro";
import {
  View,
  Image,
  Text,
  Input,
  ScrollView,
  Picker,
  Textarea
} from "@tarojs/components";
import closeImg from "@/assets/close1.png";
import rightImg from "@/assets/left.png";
import cameraImg from "@/assets/camera.png";
import { COUNTRY } from "@/constants";
import YButton from "@/components/YButton";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import TMask from "@/components/tinker/TMask";
import {
  isCurrency,
  conCurrency,
  getStorageData,
  isEmpty
} from "@/utils/utils";
import { toast } from "@/utils/tools";
import { getAddGoodsEvaluation, getEditGoodsEvaluation } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-11 14:11:59  * @Desc: OrderReturn  */

const reasonsPicker = ["选择的理由1", "选择的理由2", "选择的理由3"];

const OrderReturn = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();
  const [isOpened, setIsOpened] = useState(false);
  const [orderData, setOrderData] = useState();
  const [data, setData] = useState([]);
  const [dataTask, setDataTask] = useState();
  const [evaluation, setEvaluation] = useState();
  const [tabKey, setTabKey] = useState("Return");
  const [selectorChecked, setSelectorChecked] = useState();

  const getUserInfo = () => {
    const data = getStorageData("userInfo");
    current.userData = data;
    setUserInfo(data);
  };

  useEffect(() => {
    getUserInfo();
    getStorageData("cards_order_data").then(values => {
      console.log("cards_order_data :>> ", values);
      setOrderData(values?.order || []);
      setData(values?.data || []);
    });
    if (params?.type) {
      Taro.setNavigationBarTitle({
        title: params?.type
      });
    }
  }, []);

  const onReturnClick = values => {
    setDataTask(values);
    setIsOpened(true);
  };

  const chooseMessageClick = async () => {
    const { tempFilePaths } = await Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album"]
    });
    console.log("chooseMessageClick :>> ", tempFilePaths[0]);
    let newData = { ...userInfo };
    newData.avatar = tempFilePaths[0];
    setUserInfo(newData);
  };

  // 保存评价
  const onAddGoodsEvaluation = values => {
    getAddGoodsEvaluation({
      ...values
      // comment: "string", //评论内容
      // goodsscore: 0, // 商品评分
      // id: 0,
      // imgUrls: "string", //评价图片地址
      // isanonymity: 0, //匿名状态
      // logisticsscore: 0, //物流评分
      // orderDetailId: "string", //订单详情编号
      // orderId: "string", //订单编号
      // servicescore: 0 //服务评分
    })
      .then(res => {
        setEvaluation(res.data);
      })
      .catch(() => {});
  };
  // 编辑评价
  const onEditGoodsEvaluation = values => {
    getEditGoodsEvaluation({
      ...values
    })
      .then(res => {
        toast("Success");
        setTimeout(() => {
          Taro.navigateBack();
        }, 800);
      })
      .catch(() => {});
  };

  const onChangeReturn = () => {
    console.log(selectorChecked, tabKey, "onChangeReturn :>> ", current);
    if (!current?.returnText) {
      return;
    }
    if (evaluation?.id) {
      onEditGoodsEvaluation({
        comment: current?.returnText, //评论内容
        goodsscore: current?.comments, // 商品评分
        id: evaluation?.id,
        imgUrls: userInfo?.avatar, //评价图片地址
        isanonymity: 1, //匿名状态
        logisticsscore: 0, //物流评分
        orderDetailId: "string", //订单详情编号
        orderId: orderData?.recommendid, //订单编号
        servicescore: 0 //服务评分
      });
    } else {
      onAddGoodsEvaluation({
        comment: current?.returnText, //评论内容
        goodsscore: current?.comments, // 商品评分
        imgUrls: userInfo?.avatar, //评价图片地址
        isanonymity: 1, //匿名状态
        logisticsscore: 0, //物流评分
        orderDetailId: "string", //订单详情编号
        orderId: orderData?.recommendid, //订单编号
        servicescore: 0 //服务评分
      });
    }
  };
  const onChangePick = e => {
    console.log("onChangePick :>> ", e);
    setSelectorChecked(reasonsPicker[e.detail.value]);
  };

  const renderReturn = values => {
    return (
      <>
        <YTitleTask
          showIcon={false}
          className="order-return-top"
          title={
            <View className="order-return-top-center">
              <View className="order-return-top-center-title">Order ID:</View>
              <View className="order-return-top-center-text">
                {orderData?.recommendid}
              </View>
              <View className="order-return-top-center-title">Order Date:</View>
              <Text className="order-return-top-center-text">
                {orderData?.title}
              </Text>
            </View>
          }
          right={<View className="order-return-top-right">Pending</View>}
        />
        {data.map((item, index) => {
          return (
            <ReturnCard
              key={item?.icon || index}
              cardData={item}
              onClick={() => {
                onReturnClick(item);
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <View className="order-return">
      <ScrollView
        style={{ height: windowHeight - 120 }}
        className="user-list"
        scrollY
        // lowerThreshold={100}
        scrollWithAnimation
        refresherBackground={"#F3F5F8"}
      >
        {params?.type === "Return" && renderReturn()}
      </ScrollView>

      {/* TMask */}
      <TMask
        visible={isOpened}
        onConfirm={() => {
          setIsOpened(false);
        }}
      >
        <View className="order-return-mask">
          <View
            className="order-return-mask-clo"
            onClick={() => {
              setIsOpened(false);
            }}
          >
            <Image className={"order-return-mask-clo-img"} src={closeImg} />
          </View>

          <View className="order-return-mask-center">
            <ReturnCard cardData={dataTask} disable />

            <View className="order-return-mask-center-tab">
              <View
                className={`${
                  tabKey === "Return"
                    ? "order-return-mask-center-tab-item order-return-mask-center-tab-item-active"
                    : "order-return-mask-center-tab-item"
                }`}
                onClick={() => {
                  setTabKey("Return");
                }}
              >
                Return
              </View>
              <View
                className={`${
                  tabKey === "Refund"
                    ? "order-return-mask-center-tab-item order-return-mask-center-tab-item-active"
                    : "order-return-mask-center-tab-item"
                }`}
                onClick={() => {
                  setTabKey("Refund");
                }}
              >
                Refund
              </View>
            </View>
            <View className="order-return-mask-center-rea">
              <Picker
                mode="selector"
                range={reasonsPicker}
                onChange={onChangePick}
              >
                <YTitleTask
                  className="order-return-mask-center-rea-pic"
                  title={
                    <Input
                      className="order-return-mask-center-rea-pic-input"
                      placeholder="Please enter Reasons"
                      value={selectorChecked || ""}
                      onInput={e => {
                        current.useAddress.phone = e.detail.value;
                      }}
                    />
                  }
                  showIcon={false}
                  right={
                    <Image
                      className="order-return-mask-center-rea-pic-img"
                      src={rightImg}
                      mode="aspectFit"
                    />
                  }
                />
              </Picker>
              <View className="order-return-mask-center-rea-text">
                <Textarea
                  className="order-return-mask-center-rea-text-area"
                  placeholder="Please enter Descriptions"
                  maxlength={200}
                  onInput={e => {
                    console.log("e :>> ", e.detail?.value);
                    current.returnText = e.detail?.value;
                  }}
                  onConfirm={e => {
                    console.log("e onConfirm:>> ", e);
                  }}
                />
                <Image
                  onClick={() => {
                    chooseMessageClick();
                  }}
                  className="order-return-mask-center-rea-text-img"
                  src={cameraImg}
                  mode="aspectFit"
                />
              </View>
            </View>
          </View>
          {/* but */}
          <View className="order-return-mask-but">
            <YButton
              yType="default"
              onClick={() => {
                onChangeReturn();
              }}
            >
              <View className="order-return-mask-but-text">Return</View>
            </YButton>
          </View>
        </View>
      </TMask>
    </View>
  );
};

export default OrderReturn;

const ReturnCard = ({ cardData, onClick, disable = false }) => {
  return (
    <View className="order-return-cent">
      <View className="order-return-cent-ban">
        <Image
          className={"order-return-cent-ban-img"}
          src={cardData?.icon}
          mode="aspectFit"
        />
      </View>

      <View className="order-return-cent-item">
        <View className="order-return-cent-item-top">
          <View className="order-return-cent-item-top-title" numberOfLines={2}>
            {cardData?.title}
          </View>
          <View className="order-return-cent-item-top-price">
            {isCurrency(cardData?.unit)}
            {conCurrency(cardData?.price, 2)}
          </View>
        </View>

        <View className="order-return-cent-item-descriptor" numberOfLines={1}>
          {cardData?.descript}
        </View>

        <View className="order-return-cent-item-bot">
          <View className="order-return-cent-item-bot-tag">
            {cardData?.title}
          </View>
          {!disable && (
            <View
              className="order-return-cent-item-bot-box"
              onClick={e => {
                onClick();
              }}
            >
              Return
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
