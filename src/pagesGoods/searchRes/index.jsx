import { useState, useRef, useEffect } from "react";
import Taro, { Current, useDidHide } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import YInputSearch from "@/components/YInputSearch";
import YListView from "@/components/YListView";
import YNoData from "@/components/YNoData";
import YTabKind from "@/components/YTabKind";
import TMask from "@/components/tinker/TMask";
import YOrderCardCol from "@/components/YOrderCardCol";
import backImg from "@/assets/left.png";
import closeImg from "@/assets/close1.png";
import openImg from "@/assets/open.png";
import { SEARCH_LOCAL, COUNTRY } from "@/constants";
import GoodsCard from "@/pages/components/goodsCard";
// import SelectContainer from "@/pages/components/selectContainer";
import { getStorageData, isEmpty } from "@/utils/utils";
import { searchGoodsByTitle, getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-27 11:18:16  * @Desc: searchRes  */

const kindData = [
  { title: "General", type: 0 },
  { title: "Sale", type: 1 },
  { title: "Review", type: 2 },
  { title: "Price", type: 3, icon: true }
];

const SearchRes = () => {
  const { current } = useRef({ local: null });
  const lisGoodsListRef = useRef(null);
  const [params] = useState(Current.router.params);
  const { windowHeight } = Taro.getSystemInfoSync();
  const [tab, setTab] = useState(0);
  const [showCate, setShowCate] = useState(false);

  useEffect(() => {
    current.local = params?.text;
  }, []);

  useDidHide(() => {
    // 页面隐藏/切入后台时触发
    console.log("componentDidHide");
  });

  // 缓存用户搜索历史记录
  const localSearch = async values => {
    let data = (await getStorageData(SEARCH_LOCAL)) || "";
    if (data) {
      data = values.concat(`,${data}`);
    } else {
      data = values;
    }
    Taro.setStorage({
      key: SEARCH_LOCAL,
      data: data
    });
  };

  const onChange = values => {
    console.log("onChange :>> ", values);
    current.local = values;
  };

  const onClearClick = values => {
    console.log("onSearchChange :>> ", values);
    current.local = null;
  };

  const onSearchGoods = values => {
    // 缓存历史记录
    if (!isEmpty(values)) {
      localSearch(values);
    }
    current.local = values;
    console.log("onConfirmChange :>> ", values);
    lisGoodsListRef.current &&
      lisGoodsListRef.current.load({
        text: values,
        buyerAsc: false, //购买次数排序开关(优先级比价格低)，true-升序， false-降序， 不传为null-不排序
        priceAsc: false, // 商品价格排序开关(优先级最高)，true-升序， false-降序， 不传为null-不排序
        starAsc: false //评价排序开关(优先级最低)，true-升序， false-降序， 不传为null-不排序
        //   page: 1, //必须大于0，不传默认为1
        //   size: 20, //必须大于等于10，不传默认为20
      });
  };

  const onConfirmChange = values => {
    const searchValue = values.detail?.value || undefined;
    onSearchGoods(searchValue);
  };

  const onItemGoods = values => {
    console.log("onItemGoods :>> ", values);
    Taro.navigateTo({
      url: `/pagesGoods/detail/index?goodsId=${values.recommendid}`
    });
  };

  // 切换tab
  const onKindTabClick = ({ index, sort }) => {
    // sort:1 升；-1 降
    console.log(sort, "onKindTabClick :>> ", kindData[index]);
    setTab(index);
    lisGoodsListRef.current && lisGoodsListRef.current.load({ type: index });
  };

  const renderList = values => {
    const { data } = values;
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return (
      <View className="search-res-like">
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

  return (
    <View className="search-res">
      <View className="search-res-fix">
        <View className="search-res-fix-top">
          <Image
            className="search-res-fix-top-back"
            onClick={() => {
              Taro.navigateBack();
            }}
            src={backImg}
            mode="aspectFit"
          />
          <View className="search-res-fix-top-rt">
            <YInputSearch
              className={"search-res-fix-top-rt-input"}
              placeholder={"SearchRes"}
              onClearClick={onClearClick}
              onConfirm={onConfirmChange}
              onChange={onChange}
              initialValue={params?.text}
            />
          </View>
          <View></View>
        </View>
        <View className="search-res-fix-tab">
          {/* tab */}
          <View className="search-res-fix-tab-lr">
            <YTabKind
              data={kindData}
              onChange={onKindTabClick}
              showScree={false}
            />
          </View>
          <View
            className="search-res-fix-tab-fil"
            onClick={() => {
              setShowCate(true);
            }}
          >
            <Image
              className="search-res-fix-tab-fil-img"
              src={openImg}
              mode="aspectFit"
            />
            <View className="search-res-fix-tab-fil-text">Filters</View>
          </View>
        </View>
      </View>

      {/* list */}
      <View style={{ height: windowHeight - 110 }}>
        <YListView
          classStyle="search-res-score"
          renderList={renderList}
          // request={getRecommend}
          request={searchGoodsByTitle}
          extraParams={{
            text: params?.text,
            country: COUNTRY,
            kindid: 1,
            type: 1
          }}
          ref={lisGoodsListRef}
        />
      </View>
      {/* TMask */}
      <TMask visible={showCate}>
        <CateGories
          onClose={() => {
            setShowCate(false);
          }}
          onChange={values => {
            console.log("values :>> ", values);
            setShowCate(false);
            // lisGoodsListRef.current &&
            //   lisGoodsListRef.current.load({ type: index });
          }}
        />
      </TMask>
    </View>
  );
};

export default SearchRes;

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-27 17:50:30
 *  @Desc: CateGories
 * */

const CateGories = ({ onClose, onChange }) => {
  return (
    <>
      <View className="search-res-mask">
        <View
          className="search-res-mask-clo"
          onClick={() => {
            onClose();
          }}
        >
          <Image className={"search-res-mask-clo-img"} src={closeImg} />
          <View className="search-res-mask-clo-tex">Filters</View>
          <View></View>
        </View>
        <View className="search-res-mask-center">
          {[1, 2, 2, 3, 4, 5, 44].map((item, index) => {
            return (
              <View
                className={`search-res-mask-center-item`}
                key={item?.menuid || index}
                onClick={() => {
                  onChange(item);
                }}
              >
                <View
                  className={`search-res-mask-center-item-text`}
                  numberOfLines={2}
                >
                  {item?.title || "HIghHeeled"}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};
