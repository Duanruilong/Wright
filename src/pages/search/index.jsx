import { useState, useRef, useEffect } from "react";
import Taro, { useDidShow, useDidHide } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import YInputSearch from "@/components/YInputSearch";
import YListView from "@/components/YListView";
import YNoData from "@/components/YNoData";
import YOrderCardCol from "@/components/YOrderCardCol";
import backImg from "@/assets/left.png";
import delImg from "@/assets/del1.png";
import { COUNTRY, SEARCH_LOCAL } from "@/constants";
// import SelectContainer from "@/pages/components/selectContainer";
import { getStorageData, isEmpty } from "@/utils/utils";
import { getHots, getRecommend } from "./service";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-07 16:28:14  * @Desc:  Search */

const Search = () => {
  const { current } = useRef({ local: null, backUrl: "/pages/index/index" });
  const listViewRef = useRef(null);
  const { windowHeight } = Taro.getSystemInfoSync();

  const [localData, setLocalData] = useState([]);
  const [hotsData, setHotsData] = useState([]);

  // useEffect(() => {
  // }, []);

  useDidHide(() => {
    // 页面隐藏/切入后台时触发
    console.log("componentDidHide");
    Taro.showTabBar();
  });

  // 热搜列表
  const onHots = () => {
    getHots({
      country: COUNTRY
    })
      .then(res => {
        setHotsData(res.data);
      })
      .catch(() => {});
  };

  // 获取本地缓存搜索数据
  const onStorageLocal = async () => {
    // const data = await getStorageData(SEARCH_LOCAL);
    // if (!isEmpty(data)) {
    //   const dataArr = data.split(",");
    //   current.localData = dataArr.slice(0, 10);
    //   setLocalData(dataArr.slice(0, 10));
    // }
  };

  useDidShow(() => {
    Taro.hideTabBar();
    onStorageLocal();
    onHots();
    onGetFromPageUrl();
    // let pages = Taro.getCurrentPages(); //当前页面
    // let prevPage = pages[pages.length - 2]; //上一页面
    // console.log(prevPage.route, "/上一个页面路径-------", pages); //上一个页面路径
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

  // 获取本地缓存的搜索需要返回的页面url
  const onGetFromPageUrl = async () => {
    let data = await getStorageData("search-from-url");
    current.backUrl = data;
  };
  const onClearLocal = () => {
    Taro.setStorage({
      key: SEARCH_LOCAL,
      data: ""
    });

    setLocalData([]);
  };

  const onChange = values => {
    current.local = values;
  };

  const onClearClick = values => {
    current.local = null;
    // onSearchGoods("/");
  };

  const onSearchGoods = values => {
    // 缓存历史记录
    if (!isEmpty(values)) {
      localSearch(values);
    }
    current.local = values;
    Taro.navigateTo({
      url: `/pagesGoods/searchRes/index?text=${values}`
    });
  };

  const onConfirmChange = values => {
    const searchValue = values.detail?.value || undefined;
    onSearchGoods(searchValue);
  };

  const onCancel = () => {
    Taro.switchTab({ url: current.backUrl });
    // Taro.navigateBack();
  };

  const onItemGoods = values => {
    console.log("onItemGoods :>> ", values);

    Taro.navigateTo({
      url: `/pagesGoods/detail/index?goodsId=${values.recommendid}`
    });
  };

  const renderList = values => {
    const { data } = values;
    if (data.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return (
      <View className="search-score-like">
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
    <View className="search">
      <View className="search-top">
        <Image
          className="search-top-back"
          onClick={() => {
            onCancel();
          }}
          src={backImg}
          mode="aspectFit"
        />
        <View className="search-top-rt">
          <YInputSearch
            className={"search-top-rt-input"}
            placeholder="SearchRes"
            onClearClick={onClearClick}
            onConfirm={onConfirmChange}
            onChange={onChange}
            // initialValue={current.local}
          />
        </View>
        <View></View>
      </View>
      {/* list */}
      <ScrollView
        style={{ height: windowHeight - 70 }}
        className="search-score"
        scrollY
        lowerThreshold={100}
        scrollWithAnimation
        refresherBackground={"#F3F5F8"}
      >
        <HistoryLocal
          data={localData}
          hotsData={hotsData}
          onSearchGoods={values => {
            onSearchGoods(values);
          }}
          onClearLocal={() => {
            onClearLocal();
          }}
        />
        <View className="search-score-title">YOU MIGHT LIKE</View>
        <YListView
          renderList={renderList}
          request={getRecommend}
          ref={listViewRef}
          // manual
          extraParams={{
            country: COUNTRY,
            kindid: 1,
            type: 1
          }}
          topRender={() => {
            return null;
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Search;

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-27 16:06:06
 *  @Desc: 本地搜索历史记录
 * */

const HistoryLocal = props => {
  const { data, onSearchGoods, onClearLocal, hotsData } = props;
  return (
    <View className="search-local">
      <View className="search-local-top">
        <View className="search-local-top-lf">History</View>
        <View className="search-local-top-rt" onClick={onClearLocal}>
          <Image className={"search-local-top-rt-img"} src={delImg} />
        </View>
      </View>
      <View className="search-local-cent">
        {data.map((item, index) => {
          return (
            <View
              key={index}
              onClick={() => {
                onSearchGoods(item);
              }}
              className="search-local-cent-item"
            >
              {item}
            </View>
          );
        })}
      </View>
      <View className="search-local-top">
        <View className="search-local-top-lf">Hot</View>
      </View>
      <View className="search-local-hot">
        {hotsData.map((item, index) => {
          return (
            <View
              key={index}
              onClick={() => {
                onSearchGoods(item?.title);
              }}
              className="search-local-hot-item"
            >
              {item?.title}
            </View>
          );
        })}
      </View>
    </View>
  );
};
