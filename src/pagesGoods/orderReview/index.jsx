import { useState, useEffect, useRef } from "react";
import Taro, { Current } from "@tarojs/taro";
import {
  View,
  Image,
  Text,
  Input,
  ScrollView,
  Textarea
} from "@tarojs/components";
import cameraImg from "@/assets/camera.png";
import { COUNTRY } from "@/constants";
import YButton from "@/components/YButton";
import YTitleTask from "@/components/YTitleTask";
import YScore from "@/components/YScore";
import TMask from "@/components/tinker/TMask";
import {
  isCurrency,
  conCurrency,
  getStorageData,
  isEmpty
} from "@/utils/utils";
import { toast } from "@/utils/tools";
import {
  getGoodsEvaluation,
  getAddGoodsEvaluation,
  getEditGoodsEvaluation
} from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-11 14:11:59  * @Desc: OrderReview  */

const OrderReview = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();
  const [orderData, setOrderData] = useState();
  const [data, setData] = useState([]);
  const [reviewTitle, setReviewTitle] = useState();
  const [evaluation, setEvaluation] = useState();

  const getUserInfo = () => {
    const data = getStorageData("userInfo");
    current.userData = data;
    setUserInfo(data);
  };

  // 获取评价
  const onGoodsEvaluation = values => {
    getGoodsEvaluation({
      orderDetailId: JSON.stringify(values?.recommendid)
    })
      .then(res => {
        setEvaluation(res.data);
      })
      .catch(() => {});
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

  useEffect(() => {
    getUserInfo();
    getStorageData("cards_order_data").then(values => {
      console.log("cards_order_data :>> ", values);
      setOrderData(values?.order || []);
      setData(values?.data || []);
      onGoodsEvaluation(values?.order);
    });
    if (params?.type) {
      Taro.setNavigationBarTitle({
        title: params?.type
      });
    }
  }, []);

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

  const onDone = () => {
    console.log(reviewTitle, "onDone :>> ", current);
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

  const renderList = values => {
    return (
      <>
        <YTitleTask
          showIcon={false}
          className="order-review-top"
          title={
            <View className="order-review-top-center">
              <View className="order-review-top-center-title">Order ID:</View>
              <View className="order-review-top-center-text">
                {orderData?.recommendid}
              </View>
              <View className="order-review-top-center-title">Order Date:</View>
              <Text className="order-review-top-center-text">
                {orderData?.title}
              </Text>
            </View>
          }
          right={<View className="order-review-top-right">Pending</View>}
        />
        {data.map((item, index) => {
          return <ReturnCard key={item?.icon || index} cardData={item} />;
        })}
        <YTitleTask
          showIcon={false}
          className="order-review-top"
          title={<View className="order-review-title">Product Rates</View>}
          right={
            <YScore
              selected={orderData?.comments}
              disable={false}
              onClick={e => {
                console.log("e :>> ", e);
                current.comments = e;
              }}
            />
          }
        />
        <YTitleTask
          className="order-review-top"
          title={"Title"}
          showIcon={false}
          right={
            <Input
              className="order-review-input"
              placeholder="Please enter Descriptions"
              value={reviewTitle || ""}
              onInput={e => {
                setReviewTitle(e.detail.value);
              }}
            />
          }
        />
        <YTitleTask
          className="order-review-des"
          title={"Descriptions"}
          showIcon={false}
          right={
            <Image
              onClick={() => {
                chooseMessageClick();
              }}
              className="order-review-des-img"
              src={cameraImg}
              mode="aspectFit"
            />
          }
        />
        <View className="order-review-text">
          <Textarea
            className="order-review-text-area"
            maxlength={200}
            placeholder="Please enter Descriptions"
            onInput={e => {
              console.log("e :>> ", e.detail?.value);
              current.returnText = e.detail?.value;
            }}
            onConfirm={e => {
              console.log("e onConfirm:>> ", e);
            }}
          />
        </View>
      </>
    );
  };

  return (
    <View className="order-review">
      <ScrollView
        style={{ height: windowHeight - 140 }}
        className="order-review-score"
        scrollY
        // lowerThreshold={100}
        scrollWithAnimation
        refresherBackground={"#F3F5F8"}
      >
        {renderList()}
      </ScrollView>
      {/* but */}
      <View className="order-review-but">
        <YButton yType="default" onClick={onDone}>
          <View className="order-review-but-text">Done</View>
        </YButton>
      </View>
    </View>
  );
};

export default OrderReview;

const ReturnCard = ({ cardData, disable = false }) => {
  return (
    <View className="order-review-cent">
      <Image
        className={"order-review-cent-img"}
        src={cardData?.icon}
        mode="aspectFit"
      />

      <View className="order-review-cent-item">
        <View className="order-review-cent-item-top">
          <View className="order-review-cent-item-top-title" numberOfLines={2}>
            {cardData?.title}
          </View>
        </View>

        <View className="order-review-cent-item-descriptor" numberOfLines={1}>
          {cardData?.descript}
        </View>

        <View className="order-review-cent-item-bot">
          <View className="order-review-cent-item-bot-tag">
            {cardData?.title}
          </View>
        </View>

        <View className="order-review-cent-item-price">
          {isCurrency(cardData?.unit)}
          {conCurrency(cardData?.price, 2)}
        </View>
      </View>
    </View>
  );
};
