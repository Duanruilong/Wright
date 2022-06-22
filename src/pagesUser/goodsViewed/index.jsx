import { useState, useEffect, useRef } from "react";
import Taro, { Current, usePullDownRefresh } from "@tarojs/taro";
import { View, Image, Input, Text } from "@tarojs/components";
import backImg from "@/assets/left.png";
import { COUNTRY } from "@/constants";
import YListView from "@/components/YListView";
import YNoData from "@/components/YNoData";
import YButton from "@/components/YButton";
import YTabKind from "@/components/YTabKind";
import YOrderCard from "@/components/YOrderCard";
import { getStorageData, isCurrency, conCurrency } from "@/utils/utils";
import { getRecommend, getBrowse, getFavorites } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-22 10:57:04
 *  @Desc: userGoodsList
 *  user-recently viewed
 *  */

const kindData = [
  { title: "Recently Viewed", type: 0 },
  { title: "Favorite", type: 1 }
];

const GoodsViewed = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const listBrowseRef = useRef(null);
  const listFavoritesRef = useRef(null);
  const { current } = useRef({ userData: {}, loading: false });
  // const [userInfo, setUserInfo] = useState();
  const [searchValue, setSearchValue] = useState();
  const [chooseOrd, setChooseOrd] = useState("All");

  const [tab, setTab] = useState(-1);
  const [dates, setDates] = useState();
  const [detectData, setDetectData] = useState([]);

  const loadingText = current.loading ? "loading..." : "";

  const getUserInfo = async () => {
    const use = await getStorageData("userInfo");
    current.userData = use;
    current.loading = true;
    if (params?.type === 0 || tab === 0) {
      listBrowseRef.current &&
        listBrowseRef.current.load({ userId: use?.userid, page: 0, size: 20 });
      current.loading = false;
    } else {
      listFavoritesRef.current &&
        listFavoritesRef.current.load({
          page: 0,
          size: 20,
          country: use?.country,
          userid: use?.userid
        });
      current.loading = false;
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // 刷新数据
  const refresh = () => {
    if (params?.type === 0 || tab === 0) {
      listBrowseRef.current &&
        listBrowseRef.current.load({
          userId: current.userData?.userid,
          page: 0,
          size: 20
        });
    } else {
      listFavoritesRef.current &&
        listFavoritesRef.current.load({
          page: 0,
          size: 20,
          country: current.userData?.country,
          userid: current.userData?.userid
        });
    }
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

  // 切换tab
  const onKindTabClick = ({ index, sort }) => {
    console.log("onKindTabClick :>> ", index);
    setTab(index);
    if (index === 0) {
      listBrowseRef.current &&
        listBrowseRef.current.load({
          userId: current.userData?.userid,
          page: 0,
          size: 20
        });
    } else {
      listFavoritesRef.current &&
        listFavoritesRef.current.load({
          page: 0,
          size: 20,
          country: current.userData?.country,
          userid: current.userData?.userid
        });
    }
  };

  // 跳转商品详情
  const onItemClick = async values => {
    console.log("跳转商品详情 :>> ", values);
    Taro.navigateTo({
      url: `/pagesGoods/detail/index?goodsId=${values.goodsid}`
    });
  };

  const onDelete = () => {
    console.log("onDelete :>> ", 222);
  };

  // 搜索
  const onChangeInput = values => {
    console.log("onKindTabClick :>> ", values);
    if (params?.type === 0 || tab === 0) {
      listBrowseRef.current &&
        listBrowseRef.current.load({
          userId: current.userData?.userid,
          page: 0,
          size: 20
        });
    } else {
      listFavoritesRef.current &&
        listFavoritesRef.current.load({
          page: 0,
          size: 20,
          country: current.userData?.country,
          userid: current.userData?.userid
        });
    }
    setSearchValue(values);
  };

  // 选择商品宝贝
  const onCheckItem = (values, data) => {
    console.log("onCheckItem :>> ", values, data);
    const dataNew = [...detectData];
    const index = dataNew.findIndex(itemArr => {
      return itemArr.recommendid === data.recommendid;
    });

    if (index < 0 && values) {
      dataNew.push(data);
    } else {
      dataNew.splice(index, 1);
    }
    console.log("dataNew :>> ", dataNew);
    setDetectData(dataNew);
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
              <YOrderCard
                data={item}
                select={chooseOrd === "Selec"}
                onCheckItem={onCheckItem}
              />
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
        <View
          className={`${
            chooseOrd === "All" ? "goods-list-top-act" : "goods-list-top-end"
          } `}
          onClick={() => {
            if (chooseOrd === "All") {
              setChooseOrd("Selec");
            } else {
              setChooseOrd("All");
            }
          }}
        >
          {chooseOrd}
        </View>
      </View>

      <View className="goods-list-tab">
        {/* tab */}
        <YTabKind
          data={kindData}
          select={Number(params?.type) || 0}
          onChange={onKindTabClick}
          showScree={false}
          total={dates ? dates.length : null}
        />
      </View>
      {/* list */}
      <View
        style={{
          height:
            chooseOrd === "Selec" ? windowHeight - 201 : windowHeight - 110
        }}
      >
        {params?.type === 0 || tab === 0 ? (
          <YListView
            classStyle={`"goods-list-score" ${
              chooseOrd === "Selec"
                ? "goods-list-score-sel"
                : "goods-list-score"
            }`}
            renderList={renderList}
            request={getBrowse}
            manual
            ref={listBrowseRef}
          />
        ) : (
          <YListView
            classStyle={`"goods-list-score" ${
              chooseOrd === "Selec"
                ? "goods-list-score-sel"
                : "goods-list-score"
            }`}
            renderList={renderList}
            request={getFavorites}
            manual
            ref={listFavoritesRef}
          />
        )}
      </View>
      {/* button */}
      {chooseOrd === "Selec" && (
        <View className="goods-list-but">
          <YButton
            yType="default"
            onClick={() => {
              onDelete();
            }}
          >
            <View className="goods-list-but-cent">Delete</View>
          </YButton>
        </View>
      )}
    </View>
  );
};

export default GoodsViewed;
