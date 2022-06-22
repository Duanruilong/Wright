import { useState, useEffect, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  ScrollView,
  Swiper,
  SwiperItem
} from "@tarojs/components";
import classnames from "classnames";
import YButton from "@/components/YButton";
import YScore from "@/components/YScore";
import YCollection from "@/components/YCollection";
import YTitleTask from "@/components/YTitleTask";
import YNumIncrease from "@/components/YNumIncrease";
import YShare from "@/components/YShare";
import TMask from "@/components/tinker/TMask";
import closeImg from "@/assets/close1.png";
import user from "@/assets/user_img.png";
import location from "@/assets/location.png";
import { COUNTRY } from "@/constants";
import {
  getStorageData,
  isCurrency,
  conCurrency,
  isEmpty
} from "@/utils/utils";
import { toast } from "@/utils/tools";
import shareImg from "@/assets/to_share.png";
import {
  getGoodsInfo,
  getGoodsEvaluation,
  getStock,
  getGoodsAddCart
} from "./service";

import "./index.scss";

/**
 * @Author: duanruilong
 * @Date: 2022-04-14 11:07:28
 * @Desc: 商品详情页   GoodsDetail
 * */

const GoodsDetail = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const { current } = useRef({
    infoData: null
  });
  const [params] = useState(Current.router.params);
  const [show, setShow] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [goodsData, setGoodsData] = useState();
  const [stockData, setStockData] = useState();
  const [evaluation, setEvaluation] = useState([]);
  const [swipeData, setSwipeData] = useState([]);

  const [useAddress, setUseAddress] = useState();
  const [selectedData, setSelectedData] = useState({ increase: 1 });

  useEffect(() => {
    getStorageData("userInfo").then(values => {
      current.infoData = values;
      getDat(values?.userid);
      onStock(values?.userid);
      getEvaluation(values?.userid);
    });
  }, []);

  useDidShow(() => {
    getStorageData("cards_order_address").then(values => {
      setUseAddress(values);
    });
  });

  const onStock = userid => {
    getStock({
      goodsid: params.goodsId
    })
      .then(res => {
        const data = res.data;
        setStockData(data);
      })
      .catch(() => {});
  };

  const getDat = userid => {
    getGoodsInfo({
      goodsid: params.goodsId,
      country: COUNTRY,
      userid
    })
      .then(res => {
        console.log(current, "getGoodsInfo :>> ", res);
        const data = res.data;
        setGoodsData(data);
        setSwipeData(data.images.split(","));
        Taro.setNavigationBarTitle({
          title: data?.title
        });
      })
      .catch(() => {});
  };

  const getEvaluation = () => {
    getGoodsEvaluation({
      goodsId: params.goodsId,
      pageSize: 20,
      page: 1
    })
      .then(res => {
        console.log("getEvaluation :>> ", res);
        const data = res.data;
        setEvaluation(data);
      })
      .catch(() => {});
  };

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

  const onAddCart = () => {
    console.log(stockData, "onAddCart :>> ", selectedData);
    if (isEmpty(selectedData)) {
      return toast("Product quantity must be greater than 0");
    }
    onGoodsAddCart({
      buycount: selectedData?.increase, // 添加数量
      goodsId: params.goodsId,
      sort: 0, //排序
      stockId: 0 //库存id
    });
  };

  const shareClick = values => {
    console.log("shareClick :>> ", values);
    setShow(false);
  };

  if (isEmpty(goodsData)) {
    return null;
  }

  return (
    <View className="goods-detail">
      <ScrollView
        style={{ height: windowHeight - 280 }}
        className="goods-detail-score"
        scrollY
        lowerThreshold={100}
        scrollWithAnimation
        refresherBackground={"#F3F5F8"}
      >
        {/* index -Swiper */}
        <Swiper
          className="goods-detail-swipe"
          indicatorColor="rgba(0, 0, 0, .3)"
          indicatorActiveColor="rgba(255, 255, 255, .3)"
          previousMargin="24px"
          circular
          indicatorDots
          autoplay
        >
          {swipeData.map(item => {
            return (
              <SwiperItem key={item}>
                <View className={"goods-detail-swipe-item"}>
                  <Image
                    className={"goods-detail-swipe-item-image"}
                    src={item}
                    mode="aspectFit"
                  />
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
        {/* title */}
        <View className="goods-detail-center">
          <View className={"goods-detail-center-price"}>
            <View className={"goods-detail-center-price-lr"}>
              <View className={"goods-detail-center-price-lr-text"}>
                {isCurrency(goodsData?.unit || COUNTRY)}
                {conCurrency(goodsData?.price, 2)}
              </View>
              <View className={"goods-detail-center-price-lr-originative"}>
                {isCurrency(goodsData?.unit || COUNTRY)}
                {conCurrency(goodsData?.originprice, 2)}
              </View>
            </View>
            <View className={"goods-detail-center-price-rt"}>
              <YCollection
                like={goodsData?.islike}
                recommendId={goodsData?.recommendid}
              />
              <View
                className={"goods-detail-center-price-rt-share"}
                onClick={() => {
                  setShow(true);
                }}
              >
                <Image
                  className={"goods-detail-center-price-rt-share-img"}
                  src={shareImg}
                  mode="aspectFit"
                />
              </View>
            </View>
          </View>
          <View className={"goods-detail-center-comments"}>
            <YScore selected={goodsData?.star} />
            <View className={"goods-detail-center-comments-commit"}>
              {goodsData?.commit}
            </View>
          </View>
          <View className={`goods-detail-center-descriptor`}>
            {goodsData?.descript}
          </View>
        </View>
        {/* SELECTED */}
        <View className="goods-detail-list">
          <YTitleTask
            className="goods-detail-list-item"
            title={
              <View className="goods-detail-list-sel">
                <View className="goods-detail-list-sel-lr">SELECTED</View>
                <View className="goods-detail-list-sel-rt">
                  {selectedData &&
                    selectedData.selectedColor >= 0 &&
                    `${stockData[selectedData.selectedColor].color};`}
                  {selectedData &&
                    selectedData.selectedSize >= 0 &&
                    `${stockData[selectedData.selectedSize].size};`}
                  {selectedData &&
                    selectedData.increase &&
                    `${selectedData.increase}`}
                </View>
              </View>
            }
            onClick={() => {
              setShowStock(true);
            }}
          />
        </View>
        {/* Deliver To */}
        <View className="goods-detail-list">
          <YTitleTask
            className="goods-detail-list-item"
            title={
              <View className="goods-detail-list-sel">
                <View className="goods-detail-list-sel-lr"> Deliver To</View>
                <View className="goods-detail-list-sel-rt">
                  {useAddress && (
                    <Image
                      className={"goods-detail-list-sel-rt-img"}
                      src={location}
                      // mode="aspectFit"
                    />
                  )}
                  {useAddress
                    ? `${useAddress.city} ${useAddress.lastname}`
                    : ""}
                </View>
              </View>
            }
            onClick={() => {
              Taro.navigateTo({ url: "/pagesUser/address/index?type=check" });
            }}
          />
        </View>
        {/* Product Details */}
        <View className="goods-detail-list">
          <YTitleTask
            className="user-list-item"
            title="Product Details"
            showIcon={false}
          />
          {swipeData.map((item, index) => {
            return (
              <View key={index} className={"goods-detail-list-det"}>
                <Image
                  className={"goods-detail-list-det-img"}
                  src={item}
                  // mode="aspectFit"
                />
              </View>
            );
          })}
        </View>

        {/* 评价 */}
        {evaluation.map((item, index) => {
          return (
            <View key={index} className="goods-detail-eva">
              <View key={item?.userid} className="goods-detail-eva-cen">
                <View className={"goods-detail-eva-cen-lr"}>
                  <View className="goods-detail-eva-cen-lr-use">
                    <Image
                      className={"goods-detail-eva-cen-lr-use-img"}
                      src={item?.imgUrls || user}
                      mode="aspectFit"
                    />
                  </View>
                  <View className="goods-detail-eva-cen-lr-info">
                    <View className="goods-detail-eva-cen-lr-info-name">
                      {item?.userNickname}
                    </View>
                    <View className="goods-detail-eva-cen-lr-info-tim">
                      {item?.createtime}
                    </View>
                  </View>
                </View>
                <View className={"goods-detail-eva-cen-rt"}>TOP REVIEWS</View>
              </View>
              <YScore selected={item?.state} />
              <View className={"goods-detail-eva-com"}>{item?.comment}</View>
            </View>
          );
        })}
      </ScrollView>
      {/* YButton */}
      <View className="goods-detail-box">
        <YButton yType="default" onClick={onAddCart}>
          <View className="goods-detail-box-but">
            <View className="goods-detail-box-but-pice">
              <Text className="goods-detail-box-but-pice-tx">
                {isCurrency(current.infoData?.country || "zn")}
              </Text>
              <Text className="goods-detail-box-but-pice-tx">
                {conCurrency(goodsData?.price || 0, 2)}
              </Text>
            </View>
            <View className="goods-detail-box-but-text">Add To Cart</View>
          </View>
        </YButton>
      </View>
      {/* mask-Share */}
      <YShare showed={show} onChange={shareClick} />
      {/* mask-stock */}
      {showStock && (
        <StockMask
          current={current}
          onClose={() => {
            setShowStock(false);
          }}
          onMaskAddCart={() => {
            onAddCart();
          }}
          onChangeColor={e => {
            const newArr = { ...selectedData };
            newArr.selectedColor = e;
            setSelectedData(newArr);
          }}
          onChangeSize={e => {
            const newArr = { ...selectedData };
            newArr.selectedSize = e;
            setSelectedData(newArr);
          }}
          onChangeIncrease={e => {
            const newArr = { ...selectedData };
            newArr.increase = e;
            setSelectedData(newArr);
          }}
          goodsData={goodsData}
          stockData={stockData}
        />
      )}
    </View>
  );
};

export default GoodsDetail;

/**
 * @Author: duanruilong
 * @Date: 2022-05-10 16:29:17
 * @Desc: mask-stock- 选择库存信息
 */

const StockMask = props => {
  const {
    onClose,
    onChangeColor,
    onChangeSize,
    onChangeIncrease,
    onMaskAddCart,
    goodsData,
    stockData,
    current
  } = props;
  const [selectedColor, setSelectedColor] = useState(-1);
  const [selectedSize, setSelectedSize] = useState(-1);

  return (
    <TMask visible>
      <View className="goods-detail-mask">
        <View className="goods-detail-mask-clo">
          <Image
            className={"goods-detail-mask-clo-img"}
            src={closeImg}
            onClick={() => {
              onClose();
            }}
          />
        </View>
        <View className="goods-detail-mask-stock">
          <View className="goods-detail-mask-stock-top">
            <Image
              className={"goods-detail-mask-stock-top-img"}
              src={goodsData?.icon}
            />
            <View className={"goods-detail-mask-stock-top-pic"}>
              {isCurrency(goodsData?.unit || COUNTRY)}
              {conCurrency(goodsData?.price, 2)}
            </View>
          </View>
          {/* color */}
          <View className="goods-detail-mask-stock-tit">Color</View>
          <View className="goods-detail-mask-stock-sel">
            {stockData.map((item, index) => {
              return (
                <View
                  key={item}
                  onClick={() => {
                    setSelectedColor(index);
                    onChangeColor(index);
                  }}
                  className={classnames("goods-detail-mask-stock-sel-item", {
                    "goods-detail-mask-stock-sel-item-active":
                      selectedColor === index
                  })}
                >
                  {item?.color}
                </View>
              );
            })}
          </View>
          {/* size */}
          <View className="goods-detail-mask-stock-tit">Size</View>
          <View className="goods-detail-mask-stock-sel">
            {stockData.map((item, index) => {
              return (
                <View
                  key={item}
                  onClick={() => {
                    setSelectedSize(index);
                    onChangeSize(index);
                  }}
                  className={classnames("goods-detail-mask-stock-sel-item", {
                    "goods-detail-mask-stock-sel-item-active":
                      selectedSize === index
                  })}
                >
                  {item?.size}
                </View>
              );
            })}
          </View>
          {/* Quantity */}
          <View className="goods-detail-mask-stock-tit">Quantity</View>
          <View className="goods-detail-mask-stock-qua">
            <View className="goods-detail-mask-stock-qua-increase">
              <YNumIncrease
                onChange={values => {
                  onChangeIncrease(values);
                }}
              />
            </View>
            <View>In Stock</View>
          </View>
          {/* button */}
          <View className="goods-detail-mask-box">
            <YButton yType="default" onClick={onMaskAddCart}>
              <View className="goods-detail-mask-box-but">
                <View className="goods-detail-mask-box-but-pice">
                  <Text className="goods-detail-mask-box-but-pice-tx">
                    {isCurrency(current.infoData?.country || "zn")}
                  </Text>
                  <Text className="goods-detail-mask-box-but-pice-tx">
                    {conCurrency(goodsData?.price || 0, 2)}
                  </Text>
                </View>
                <View className="goods-detail-mask-box-but-text">
                  Add To Cart
                </View>
              </View>
            </YButton>
          </View>
        </View>
      </View>
    </TMask>
  );
};
