import { useState, useRef, useEffect, useReducer } from "react";
import Taro, { useDidShow, usePullDownRefresh } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import { COUNTRY } from "@/constants";
import YNumIncrease from "@/components/YNumIncrease";
import YNoData from "@/components/YNoData";
import YButton from "@/components/YButton";
import YCollection from "@/components/YCollection";
import {
  isCurrency,
  conCurrency,
  getStorageData,
  isEmpty,
  debounce
} from "@/utils/utils";
import { toast } from "@/utils/tools";
import GoodsPrice from "@/pages/components/goodsPrice";
import selectNo from "@/assets/select_no.png";
import selectItem from "@/assets/select_yes.png";
import delImg from "@/assets/del1.png";
import { getRecommend, getCartList, getDelCart } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-18 10:57:22
 *  @Desc: 购物车
 *
 *
 *   */

function reducer(state, action) {
  return { ...state, ...action };
}

const Cart = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const dataKey = "recommendid";
  const { current } = useRef({
    infoData: null,
    increaseData: {}, // 保存商品数量变化
    selectData: [],
    selectKeys: {},
    canSelectAll: false,
    params: {},
    pn: 1,
    ps: 10,
    tc: 0
  });

  const [touchIndex, setTouchIndex] = useState();
  let timer;

  const [goodsData, setGoodsData] = useState([]);
  const [hideAll, setHideAll] = useState(false);
  const [hideItem, setHideItem] = useState(false);
  const showMore = current.tc > goodsData.length;
  const selectAll =
    current.selectData.length > 0 &&
    current.selectData.length >= goodsData.length;

  const request = params => {
    getRecommend({ ...params }).then(res => {
      current.params.pn++;
      current.tc = res?.tc;
      handlerData(res);
    });
  };

  const handlerData = res => {
    const { pn, data } = res;
    console.log("res---handlerData--- :>> ", res);
    if (data.length === 0) {
      if (pn > 1) {
        return;
      }
    }
    let dataArr = [...data];

    // 已选数据处理
    if (Object.keys(current.selectKeys).length > 0) {
      dataArr = dataArr.filter(item => {
        return !current.selectKeys[item[dataKey]];
      });
    }

    //pn为1时需要重置数据
    let dataRe = [];
    if (pn === 1) {
      dataRe = current.selectData.concat(dataArr);
    } else {
      dataRe = goodsData.concat(dataArr);
    }
    const dataReNew = [...dataRe];
    let newArr = [];
    let obj = {};
    for (let i = 0; i < dataReNew.length; i++) {
      // 添加数量字段
      dataReNew[i].num = 1;
      if (!obj[dataReNew[i].recommendid]) {
        newArr.push(dataReNew[i]);
        obj[dataReNew[i].recommendid] = true;
      }
    }
    setGoodsData(newArr);
    // 处理筛选后不能正常翻页问题
    if (
      current.ps * pn < current.tc &&
      (dataRe.length < current.ps || dataArr.length === 0)
    ) {
      request();
    }
  };

  useDidShow(() => {
    // 缓存搜索页面返回url
    Taro.setStorage({
      key: "search-from-url",
      data: "/pages/cart/index"
    });
  });

  useEffect(() => {
    // 清除临时缓存数据
    Taro.removeStorage({ key: "cards_order_data" });
    getStorageData("userInfo").then(values => {
      current.infoData = values;
      refresh();
    });
  }, []);

  const refresh = () => {
    request({
      token: current.infoData?.token,
      country: COUNTRY,
      kindid: 1,
      type: 1
      // page: 1, //必须大于0，不传默认为1
      // size: 20 //必须大于等于10，不传默认为20
    });
  };

  // 下拉刷新
  usePullDownRefresh(() => {
    console.log("current.loading :>> ", current.loading);
    if (current.loading) {
      return;
    }
    // wx.startPullDownRefresh();
    refresh();
  });

  // 选中商品
  const onItemClick = item => () => {
    console.log("onItemClick :>> ", item);
    const key = item[dataKey];
    const selected = current.selectKeys[key];
    let selectArr = [...current.selectData];
    let dataArr = [...goodsData];
    // 点击选中item时，从已选中数据删除该item，点击未选中的item时，已选中数据添加该item
    if (selected) {
      selectArr = selectArr.filter(itemArr => {
        return itemArr[dataKey] !== key;
      });
      delete current.selectKeys[key];
    } else {
      selectArr.push({ ...item, selected: true });
      current.selectKeys[key] = key;
    }
    current.selectData = selectArr;
    setGoodsData(dataArr);
  };

  const onAddCredits = async () => {
    console.log("current.selectData :>> ", current);
    const { selectData } = current;
    if (selectData.length < 1) {
      toast("Please select a product");
      return;
    }
    for (let i = 0; i < selectData.length; i++) {
      let dataArr = selectData[i];
      if (current.increaseData[dataArr.recommendid]) {
        dataArr.num = current.increaseData[dataArr.recommendid];
      }
    }
    console.log("selectData :>> ", selectData);
    await Taro.setStorage({
      key: "cards_order_data",
      data: { order: selectData[0], data: selectData }
    });
    Taro.navigateTo({
      url: "/pagesGoods/order/index"
    });
  };

  // 全选
  const onSelectAll = () => {
    let dataArr = [...goodsData];
    let selectDataNew = [...current.selectData];
    let tael = 0;
    // 从前到后遍历当前列表，如果未选中切未到最大选中数量，则选中item
    for (let i = 0; i < goodsData.length; i++) {
      const element = goodsData[i];
      const key = element[dataKey];
      tael += element.price * element.num;
      if (!current.selectKeys[key]) {
        selectDataNew.push(dataArr[i]);
        current.selectKeys[key] = key;
      }
    }
    current.selectData = selectDataNew;
    setGoodsData(dataArr);
  };

  // 取消全选
  const onSelectNo = () => {
    let dataArr = [...goodsData];
    current.selectData = [];
    current.selectKeys = {};
    setGoodsData(dataArr);
  };

  // 修改数量
  const onNumIncrease = item => {
    const { data, values } = item;
    let dataArr = [...goodsData];
    current.increaseData[data.recommendid] = values;

    for (let i = 0; i < dataArr.length; i++) {
      let dataNew = dataArr[i];
      if (dataNew.recommendid === data.recommendid) {
        dataNew.num = values;
      }
    }

    // 是否为选中状态
    const selected = current.selectKeys[data.recommendid];
    if (selected) {
      let selectArr = [...current.selectData];
      for (let i = 0; i < selectArr.length; i++) {
        let selNew = selectArr[i];
        if (selNew.recommendid === data.recommendid) {
          selNew.num = values;
        }
      }
    }

    setGoodsData(dataArr);
  };

  const onPullUp = () => {
    console.log("onPullUp :>> ", showMore);
    if (showMore) {
      request();
    }
  };

  /**  * @Author: duanruilong  * @Date: 2022-04-28 16:44:51  * @Desc:item 长按操作 -start */

  // 长按事件
  const handleTouchEnd = () => {
    console.log("End ---33333-----:>> ", touchIndex);
    if (touchIndex === -1) {
      setTouchIndex(null);
    }
    clearTimeout(timer);
  };

  const touchStart = index => {
    console.log("Start ---11111-----:>> ", touchIndex);
    if (touchIndex === -1) {
      return;
    }
    timer = setTimeout(() => {
      //  你要do的事
      setTouchIndex(index);
      console.log(touchIndex, "//  你要do的事 :>> ", index);
    }, 1500);
  };

  /**  * @Author: duanruilong  * @Date: 2022-04-28 16:44:51  * @Desc:item 长按操作-end  */

  const renderList = () => {
    // console.log("goodsData :>> ", goodsData);
    if (goodsData.length === 0) {
      return <YNoData desc={"No data"} />;
    }
    return goodsData.map((item, index) => {
      return (
        <View key={`${item?.recommendid}-${index}`}>
          {/* <OrderHandleTouch
            selectKeys={current.selectKeys[item?.recommendid]}
            touchIndex={touchIndex}
            scrollIndex={index}
            current={current}
            goodsData={goodsData}
            data={item}
            onItemClick={onItemClick(item)}
            onNumChange={values => {
              onNumIncrease({ ...values });
            }}
            onDelDataClick={values => {
              setGoodsData(values);
            }}
            hideTouch={() => {
              setTouchIndex(null);
            }}
            touchStart={() => {
              touchStart(index);
            }}
            handleTouchEnd={() => {
              handleTouchEnd();
            }}
          /> */}
          <OrderScrollX
            selectKeys={current.selectKeys[item?.recommendid]}
            hideItem={hideItem}
            hideAll={hideAll}
            scrollIndex={index}
            current={current}
            goodsData={goodsData}
            data={item}
            onItemClick={onItemClick(item)}
            onNumChange={values => {
              onNumIncrease({ ...values });
            }}
            onDelDataClick={values => {
              setGoodsData(values);
            }}
            changeHideAll={() => {
              setHideAll(false);
            }}
            changeHideItem={() => {
              setHideItem(!hideItem);
            }}
          />
        </View>
      );
    });
  };

  return (
    <View className="cart">
      {/* list */}
      <ScrollView
        style={{
          height: windowHeight - 730
        }}
        className="cart-score"
        scrollY
        scrollWithAnimation
        onScrollToLower={onPullUp}
        onScroll={e => {
          if (!hideAll) {
            setHideAll(true);
          }
          // touch
          if (touchIndex > -1) {
            setTouchIndex(-1);
          }
        }}
      >
        {renderList()}
        {showMore ? (
          <View className={"cart-score-more"}>Pull up to load more</View>
        ) : null}
      </ScrollView>
      {/* button */}
      <View className="cart-but">
        <View className="cart-but-top">
          <View className="cart-but-top-lr">
            <View className="cart-but-top-lr-radio">
              {selectAll ? (
                <Image
                  className={"cart-but-top-lr-radio-img"}
                  src={selectItem}
                  onClick={onSelectNo}
                />
              ) : (
                <Image
                  className={"cart-but-top-lr-radio-img"}
                  src={selectNo}
                  onClick={() => {
                    onSelectAll();
                  }}
                />
              )}
            </View>
            <View className="cart-but-top-lr-text">All Items</View>
          </View>
          <GoodsPrice selectData={current.selectData} data={goodsData} />
        </View>
        <YButton yType="default" onClick={onAddCredits}>
          <View className="cart-but-cent">Check Out</View>
        </YButton>
      </View>
    </View>
  );
};

export default Cart;

/**  * @Author: duanruilong  * @Date: 2022-04-28 16:26:32  * @Desc: 长按操作  */
const OrderHandleTouch = props => {
  const {
    touchIndex,
    data,
    scrollIndex,
    goodsData,
    selectKeys,
    onItemClick,
    onNumChange,
    onDelDataClick
  } = props;

  // useEffect(() => {
  //   setScrollToLeft(1);
  // }, [touchIndex]);

  // 删除
  const onDelClick = () => {
    getDelCart({
      cartIdS: data?.recommendid,
      token: props.current.infoData?.userid
    })
      .then(res => {
        console.log(data, "删除 onDelClick :>> ", res);
        toast("Success");
        const key = data["recommendid"];
        const selected = props.current.selectKeys[key];
        let dataArr = [...goodsData];
        if (selected) {
          delete props.current.selectKeys[key];
        }
        dataArr = dataArr.filter(itemArr => {
          return itemArr["recommendid"] === key;
        });
        onDelDataClick(dataArr);
      })
      .catch(() => {});
  };

  return (
    <View className="cart-score-x">
      <View
        className={"cart-score-x-lf"}
        onStartShouldSetResponderCapture={ev => true}
        onTouchStart={e => {
          if (process.env.TARO_ENV !== "rn") {
            e.stopPropagation();
          }
          props.touchStart();
        }}
        onTouchEnd={() => {
          props.handleTouchEnd();
        }}
      >
        <View className="cart-score-item">
          <Image
            onClick={() => {
              onItemClick();
            }}
            className="cart-score-item-radio"
            src={selectKeys ? selectItem : selectNo}
          />
          <Image
            className="cart-score-item-img"
            src={data?.icon}
            mode="aspectFit"
          />
          <View className="cart-score-item-cent">
            <View className="cart-score-item-cent-title" numberOfLines={1}>
              {data?.title}
            </View>
            <View className="cart-score-item-cent-descriptor" numberOfLines={1}>
              {data?.descript}
            </View>
            <View className="cart-score-item-cent-info">{data?.title}</View>
            <View className="cart-score-item-cent-inc">
              <View className="cart-score-item-cent-inc-price">
                {isCurrency(data?.unit)}
                {conCurrency(data?.price, 2)}
              </View>
              <View className="cart-score-item-cent-inc-increase">
                <YNumIncrease
                  onChange={values => {
                    onNumChange({ data: data, values });
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* 操作 */}
      {touchIndex === scrollIndex && (
        <View
          className="cart-score-x-touch"
          onClick={() => {
            props.hideTouch();
          }}
        >
          <View className="cart-score-x-touch-but">
            <YCollection
              like={data?.islike}
              recommendId={data?.recommendid}
              onChange={() => {
                props.hideTouch();
              }}
            />
          </View>
          <View className="cart-score-x-touch-but">
            <Image
              onClick={() => {
                onDelClick();
              }}
              className="cart-score-x-touch-img"
              src={delImg}
            />
          </View>
        </View>
      )}
    </View>
  );
};

/**  * @Author: duanruilong  * @Date: 2022-04-28 16:26:55  * @Desc: 滑动操作  */
const OrderScrollX = props => {
  const { current } = useRef({
    scroll: 0,
    index: props.index
  });
  const {
    hideAll,
    hideItem,
    data,
    scrollIndex,
    goodsData,
    selectKeys,
    onItemClick,
    onNumChange,
    onDelDataClick
  } = props;
  const [scrollToLeft, setScrollToLeft] = useState(0);

  useEffect(() => {
    setScrollToLeft(1);
  }, [hideAll === true]);

  useEffect(() => {
    setScrollToLeft(1);
  }, [hideItem]);

  // 删除
  const onDelClick = () => {
    getDelCart({
      cartIdS: data?.recommendid,
      token: props.current.infoData?.token
    })
      .then(res => {
        console.log(data, "删除 onDelClick :>> ", res);
        toast("Success");
        const key = data["recommendid"];
        const selected = props.current.selectKeys[key];
        let dataArr = [...goodsData];
        if (selected) {
          delete props.current.selectKeys[key];
        }
        dataArr = dataArr.filter(itemArr => {
          return itemArr["recommendid"] === key;
        });
        onDelDataClick(dataArr);
        setScrollToLeft(1);
      })
      .catch(() => {});
  };

  const scrollToLower = () => {
    setScrollToLeft(current.scroll);
    Taro.setStorage({
      key: "cart_item_scroll_check",
      data: scrollIndex
    });
  };

  const touchStart = async () => {
    const index = await getStorageData("cart_item_scroll_check");

    if (index !== scrollIndex) {
      props.changeHideItem();
    }
  };

  return (
    <ScrollView
      className="cart-score-x"
      scrollLeft={scrollToLeft}
      scrollX // 横向
      scrollWithAnimation
      showsHorizontalScrollIndicator={false} // 此属性为true的时候，显示一个水平方向的滚动条。
      onScroll={e => {
        current.scroll = e.detail.scrollLeft;
        console.log("obj横向ect :>> ", current.scroll);
        if (hideAll) {
          props.changeHideAll();
        }
      }}
      onScrollToLower={e => {
        console.log("3333333 :>> ", e);
        scrollToLower();
      }}
    >
      <View
        className={"cart-score-x-lf"}
        onStartShouldSetResponderCapture={ev => true}
        onTouchStart={e => {
          if (process.env.TARO_ENV !== "rn") {
            e.stopPropagation();
          }
          touchStart();
        }}
      >
        <View className="cart-score-item">
          <Image
            onClick={() => {
              onItemClick();
            }}
            className="cart-score-item-radio"
            src={selectKeys ? selectItem : selectNo}
          />
          <Image
            className="cart-score-item-img"
            src={data?.icon}
            mode="aspectFit"
          />
          <View className="cart-score-item-cent">
            <View className="cart-score-item-cent-title" numberOfLines={1}>
              {data?.title}
            </View>
            <View className="cart-score-item-cent-descriptor" numberOfLines={1}>
              {data?.descript}
            </View>
            <View className="cart-score-item-cent-info">{data?.title}</View>
            <View className="cart-score-item-cent-inc">
              <View className="cart-score-item-cent-inc-price">
                {isCurrency(data?.unit)}
                {conCurrency(data?.price, 2)}
              </View>
              <View className="cart-score-item-cent-inc-increase">
                <YNumIncrease
                  onChange={values => {
                    onNumChange({ data: data, values });
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className={"cart-score-x-rt"}>
        <YCollection
          like={data?.islike}
          recommendId={data?.recommendid}
          onChange={() => {
            setScrollToLeft(1);
          }}
        />
        <Image
          onClick={() => {
            onDelClick();
          }}
          className="cart-score-x-rt-img"
          src={delImg}
        />
      </View>
    </ScrollView>
  );
};
