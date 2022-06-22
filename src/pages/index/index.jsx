import { useState, useEffect, useRef } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import {
  View,
  Image,
  Swiper,
  SwiperItem,
  ScrollView
} from "@tarojs/components";
import { COUNTRY } from "@/constants";
import YNoData from "@/components/YNoData";
import YSafeAreaView from "@/components/YSafeAreaView";
import YListView from "@/components/YListView";
import YOrderCardCol from "@/components/YOrderCardCol";
import TMask from "@/components/tinker/TMask";
import scan_code from "@/assets/scan_code.png";
import QR_code from "@/assets/QR_code.png";
import append from "@/assets/append.png";
import use_card from "@/assets/use_card.png";
import commodityImg from "@/assets/commodity.png";
import closeImg from "@/assets/close1.png";
import { getUserId, loginOutHandler } from "@/utils/loginHandler";
import { isCurrency } from "@/utils/utils";
// import SelectContainer from "@/pages/components/selectContainer";
import KindTab from "./components/KindTab";
import { getAds, getMenus, getKind, getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-07 10:27:14  * @Desc: Index  */

const searchMore = [
  { type: "Scan", name: "Scan", url: scan_code },
  { type: "QR", name: "My QR", url: QR_code },
  { type: "Friend", name: "New Friend", url: append },
  { type: "Pay", name: "Payment", url: use_card }
];

const Index = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const listViewRef = useRef(null);
  const [clerkData, setClerkData] = useState([]);
  const [menusData, setMenusData] = useState([]);
  const [kindData, setKindData] = useState([]);
  const [kindSecondData, setKindSecondData] = useState([]);
  const [kindTabSelect, setKindTabSelect] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showCate, setShowCate] = useState(false);

  // 首页广告
  const onAds = () => {
    getAds({
      country: COUNTRY
    })
      .then(res => {
        setClerkData(res.data);
      })
      .catch(() => {});
  };

  // 首页菜单
  const onMenus = () => {
    getMenus({
      country: COUNTRY
    })
      .then(res => {
        setMenusData(res.data);
      })
      .catch(() => {});
  };

  // 分类列表
  // 分类id,传-1获取顶级分类,传其他获取对应子分类列表
  const onKind = (kindid = -1) => {
    getKind({
      country: COUNTRY,
      kindid
    })
      .then(res => {
        if (kindid === -1) {
          setKindData(res.data);
        } else {
          setKindSecondData(res.data);
        }
      })
      .catch(() => {});
  };

  const onSession = () => {
    getUserId().then(values => {
      console.log("getUserId :>> ", values);
      if (!values) {
        loginOutHandler();
      } else {
        onAds();
        onKind();
        onMenus();
      }
    });
  };

  useDidShow(() => {
    onSession();
    // 缓存搜索页面返回url
    Taro.setStorage({
      key: "search-from-url",
      data: "/pages/index/index"
    });
    Taro.showTabBar();
    // TODO:为了测试-start
    // Taro.navigateTo({ url: "/pages/search/index" });
    // Taro.clearStorage();
    // TODO:为了测试-end
  });

  const onKindTabClick = index => {
    console.log(index, "onKindTabClick :>> ", kindData);
    setKindTabSelect(index);
    if (index === 1) {
      onKind(kindData[index].kindid);
    }
    listViewRef.current &&
      listViewRef.current.load({
        country: COUNTRY,
        kindid: kindData[index].kindid,
        type: 2 //列表类型 1首页列表 2分类列表
      });
  };

  const onScreen = () => {
    console.log("onKindTabClick :>> ", 11111);
    setShowCate(true);
  };

  const onSearchClick = () => {
    Taro.switchTab({ url: "/pages/search/index" });
    if (showMore) setShowMore(!showMore);
  };

  const onSearchAddClick = () => {
    setShowMore(!showMore);
  };

  const onItemGoods = values => {
    console.log("onItemGoods :>> ", values);

    Taro.navigateTo({
      url: `/pagesGoods/detail/index?goodsId=${values.recommendid}`
    });
  };

  const onSearchMoreClick = async values => {
    console.log("onSearchMoreClick :>> ", values);
    if (values === "Scan") {
      //调起客户端扫码
      await Taro.scanCode({
        onlyFromCamera: true,
        success: res => {
          console.log("调起客户端扫码", res);
        }
      });
    } else if (values === "QR") {
      //展示二维码
      Taro.navigateTo({
        url: `/pagesUser/code/index`
      });
    } else if (values === "Friend") {
      //联系人
      Taro.switchTab({ url: "/pages/chat/index" });
    } else if (values === "Pay") {
      //联系人
      Taro.navigateTo({ url: "/pagesUser/payment/index" });
    }

    setShowMore(!showMore);
  };

  const renderList = values => {
    const { data } = values;
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return (
      <View className="wright-like">
        {data.map(item => {
          return (
            <View
              key={item.recommendid}
              onClick={() => {
                onItemGoods(item);
              }}
            >
              <YOrderCardCol data={item} />
            </View>
          );
        })}
      </View>
    );
  };
  console.log("kindTabSelect :>> ", kindTabSelect);
  return (
    <YSafeAreaView className="wright">
      <View className="wright-search">
        <View className={"wright-search-item"} onClick={onSearchClick}>
          Search
        </View>
        <View className={"wright-search-add"} onClick={onSearchAddClick}>
          +
        </View>
      </View>

      {/* tab */}
      <KindTab data={kindData} onChange={onKindTabClick} onScreen={onScreen} />
      {/* ScrollView-list */}
      <ScrollView
        style={{ height: windowHeight - 300 }}
        // className="wright-list-score"
        classStyle="wright-score"
        scrollY
        lowerThreshold={100}
        scrollWithAnimation
        refresherBackground={"#F3F5F8"}
      >
        {kindTabSelect === 0 && (
          <BannerMenus clerkData={clerkData} menusData={menusData} />
        )}
        {kindTabSelect === 1 && <HoesMenus data={kindSecondData} />}
        {/* list */}
        <View className="wright-title">YOU MIGHT LIKE</View>
        <YListView
          // classStyle="wright-score"
          renderList={renderList}
          request={getRecommend}
          extraParams={{
            country: COUNTRY,
            kindid: 1,
            type: 1
          }}
          ref={listViewRef}
        />
      </ScrollView>
      {/* showMore-modal */}
      {showMore && (
        <View
          // style={{ height: windowHeight - 10 }}
          className="wright-more"
          onClick={() => {
            onSearchAddClick();
          }}
        >
          <View className="wright-more-top"></View>
          <View className="wright-more-center">
            {searchMore.map(item => {
              return (
                <View
                  key={item.type}
                  className="wright-more-center-item"
                  onClick={() => {
                    onSearchMoreClick(item.type);
                  }}
                >
                  <Image
                    className={"wright-more-center-item-image"}
                    src={item.url}
                  />
                  <View className={"wright-more-center-item-tex"}>
                    {item.name}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
      {/* TMask */}
      <TMask visible={showCate}>
        <CateGories
          onClose={() => {
            setShowCate(false);
          }}
        />
      </TMask>
    </YSafeAreaView>
  );
};

export default Index;

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-26 17:44:43
 *  @Desc: 默认第一部分展示banner、 首页菜单 模块
 * */

const BannerMenus = ({ clerkData, menusData }) => {
  return (
    <>
      {/* index -Swiper */}
      {clerkData && clerkData.length > 0 && (
        <Swiper
          className="wright-swipe"
          indicatorColor="rgba(0, 0, 0, .3)"
          indicatorActiveColor="rgba(255, 255, 255, .3)"
          previousMargin="24px"
          circular
          indicatorDots
          autoplay
        >
          {clerkData.map(item => {
            return (
              <SwiperItem key={item.adid}>
                <View
                  className="wright-swipe-item"
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pagesGoods/bannerDetail/index?adId=${item.adid}`
                    });
                  }}
                >
                  <Image
                    className={"wright-swipe-item-image"}
                    src={item.url}
                    mode="aspectFit"
                  />
                  {item.title}
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
      )}
      {/*首页菜单 模块 */}
      <View className="wright-center">
        {menusData.map(item => {
          return (
            <View
              className="wright-center-item"
              key={item.menuid}
              onClick={() => {
                Taro.navigateTo({
                  url: `/pagesGoods/bannerDetail/index?adId=${item.adid}`
                });
              }}
            >
              <Image className={"wright-center-item-image"} src={item.url} />
              <View className={"wright-center-item-text"}>{item.title}</View>
            </View>
          );
        })}
      </View>
    </>
  );
};

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-26 17:50:30
 *  @Desc: shoes 模块
 * */

const HoesMenus = ({ data }) => {
  return (
    <>
      <View className="wright-hoes">
        {data.map((item, index) => {
          return (
            <View
              className={`wright-hoes-item ${(index === 1 || index === 4) &&
                "wright-hoes-item-mr"}`}
              key={item?.menuid || index}
              onClick={() => {
                Taro.navigateTo({
                  url: `/pagesGoods/bannerDetail/index?adId=${item?.adid}`
                });
              }}
            >
              <Image
                className={"wright-hoes-item-image"}
                src={item?.url || commodityImg}
              />
              <View className={"wright-hoes-item-text"} numberOfLines={2}>
                {item?.title || "HIghHeeled"}
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
};

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-27 17:50:30
 *  @Desc: CateGories
 * */

const CateGories = ({ onClose }) => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [selectTit, setSelectTit] = useState(0);

  return (
    <>
      <View className="wright-cate">
        <View
          className="wright-cate-clo"
          onClick={() => {
            onClose();
          }}
        >
          <Image className={"wright-cate-clo-img"} src={closeImg} />
          <View className="wright-cate-clo-tex">Categories</View>
          <View></View>
        </View>
        <View className="wright-cate-center">
          <ScrollView
            className="wright-cate-center-lr"
            style={{ height: windowHeight - 100 }}
            scrollY
            lowerThreshold={100}
            scrollWithAnimation
          >
            {[
              1,
              2,
              2,
              3,
              4,
              5,
              44,
              44,
              55,
              234,
              234,
              435,
              345,
              4,
              44,
              44,
              55,
              234,
              234,
              435,
              345,
              4,
              4,
              4,
              55,
              234,
              234,
              234,
              66666
            ].map((item, index) => {
              return (
                <View
                  className={`wright-cate-center-lr-item`}
                  key={item?.menuid || index}
                  onClick={() => {
                    setSelectTit(index);
                  }}
                >
                  <View
                    className={`wright-cate-center-lr-item-text  ${index ===
                      selectTit && "wright-cate-center-lr-item-text-act"}`}
                    numberOfLines={2}
                  >
                    {item?.title || "HIghHeeled"}
                    {item}
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <ScrollView
            style={{ height: windowHeight - 100 }}
            scrollY
            lowerThreshold={100}
            scrollWithAnimation
          >
            <View className="wright-cate-center-rt">
              {[
                1,
                2,
                3,
                1,
                2,
                2,
                3,
                4,
                5,
                44,
                55,
                234,
                234,
                435,
                2,
                3,
                4,
                5,
                44,
                55,
                234,
                234,
                435,
                345,
                4,
                4,
                4,
                44,
                55,
                234,
                234,
                435,
                345,
                4,
                4,
                4,
                4,
                4,
                4,
                9999
              ].map((item, index) => {
                return (
                  <View
                    className={`wright-cate-center-rt-item`}
                    key={item?.menuid || index}
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/pagesGoods/searchRes/index?adId=${item?.adid}`
                      });
                      onClose();
                    }}
                  >
                    <View className={"wright-cate-center-rt-item-image"}>
                      <Image
                        className={"wright-cate-center-rt-item-image-img"}
                        src={item?.url || commodityImg}
                      />
                    </View>

                    <View
                      className={"wright-cate-center-rt-item-text"}
                      // numberOfLines={1}
                    >
                      {item?.title || "HIghHeeled"}
                      {item}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};
