import React, { useState, useEffect, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import classnames from "classnames";
import YTitleTask from "@/components/YTitleTask";
import YNoData from "@/components/YNoData";
import YInputSearch from "@/components/YInputSearch";
import appendImg from "@/assets/append.png";
import user from "@/assets/use_img1.png";
import { ALPHABETIC, COUNTRY } from "@/constants";
import { toast } from "@/utils/tools";
import { getStorageData, isEmpty } from "@/utils/utils";
import { getRecommend } from "./service";
import "./index.scss";

const pinyin = require("pinyin");

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-29 10:57:04
 *  @Desc: Contact
 *  */

const buildData = (offset = 0) => {
  return Array(100)
    .fill(0)
    .map((_, i) => i + offset);
};

const Contact = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userData: {} });
  const [data, setData] = useState(buildData(0));
  const [sections, setSections] = useState([]); //section数组
  const [letterArr, setLetterArr] = useState([]); //首字母数组
  const [activeLetterIndex, setActiveLetterIndex] = useState(0); //首字母数组
  const [scrollTo, setScrollTo] = useState(0);

  const getUserInfo = async () => {
    const use = await getStorageData("userInfo");
    current.userData = use;
  };

  // 获取数据
  const onListData = value => {
    getRecommend({
      country: COUNTRY,
      kindid: 1,
      type: 1
    }).then(res => {
      setData(res?.data || []);
      getCC(res?.data);
    });
  };

  // useDidShow(() => {
  //   // 清除临时缓存数据
  //   Taro.removeStorage({ key: "order_address_item" });
  //   getUserInfo();
  //   onListData();
  // });

  useEffect(() => {
    // 清除临时缓存数据
    Taro.removeStorage({ key: "order_address_item" });
    getUserInfo();
    onListData();
  }, []);

  // 拼音字母装换
  const getCC = values => {
    // 将数据列表转化为拼音存储，以便于拼音搜索
    //-----------数据源
    const valuesArr = [...values];
    valuesArr.forEach((item, index, arr) => {
      // 将Item的名称转为拼音数组
      let pinyinArr = pinyin(item.title, { style: pinyin.STYLE_NORMAL });
      item.pinyinArr = pinyinArr;
      let pinyinArrStr = "";
      // 将拼音数组转化为一个字符串，以支持拼音搜索
      for (let i = 0; i < pinyinArr.length; i++) {
        for (let j = 0; j < pinyinArr[i].length; j++) {
          pinyinArrStr = pinyinArrStr + pinyinArr[i][j];
        }
      }
      item.pinyinArrStr = pinyinArrStr;
    });
    transferToSectionsData(valuesArr);
  };

  /**
   * 转化数据列表
   */

  const transferToSectionsData = values => {
    //获取联系人列表
    let sections = [],
      letterArr = [];
    // 右侧字母栏数据处理
    values.forEach(item => {
      let itemTemp = pinyin(item.title.substring(0, 1), {
        style: pinyin.STYLE_FIRST_LETTER
      })[0][0].toUpperCase();
      letterArr.push(itemTemp);
    });
    letterArr = [...new Set(letterArr)].sort();
    setLetterArr(letterArr);

    // 分组数据处理
    letterArr.forEach(item => {
      sections.push({
        title: item,
        data: []
      });
    });

    values.forEach(item => {
      let listItem = item;
      sections.forEach(item1 => {
        const icon = listItem.icon;
        let firstName = listItem.title.substring(0, 1);
        let firstLetter = pinyin(firstName, {
          style: pinyin.STYLE_FIRST_LETTER
        })[0][0].toUpperCase();
        let pinyinStrArr = pinyin(listItem.title, {
          style: pinyin.STYLE_NORMAL
        });
        if (item1.title === firstLetter) {
          item1.data.push({
            icon,
            // firstName: firstName,
            title: listItem.title,
            recommendid: listItem.recommendid
          });
        }
      });
    });

    console.log("letterArr 分组数据处理:>> ", sections);
    setSections(sections);
  };

  const onChange = values => {
    current.local = values;
  };

  const onClearClick = values => {
    console.log("onSearchChange :>> ", values);
    current.local = null;
    getCC(data);
  };

  /**
   * 在拼音数组中搜索单个拼音，如果匹配，则返回等于大于0的值，否则返回-1
   */
  const pinyinSingleLetterIndexSearch = (keyword, pinyinArr) => {
    let result = -1;
    if (keyword && pinyinArr) {
      for (let i = 0; i < pinyinArr.length; i++) {
        for (let j = 0; j < pinyinArr[i].length; j++) {
          let singleLetterIndex = pinyinArr[i][j]
            .toLocaleLowerCase()
            .indexOf(keyword);
          if (singleLetterIndex >= 0) {
            return singleLetterIndex;
          }
        }
      }
    }
    return result;
  };

  const onConfirmChange = values => {
    const searchValue = values.detail?.value || undefined;
    current.local = searchValue;
    if (searchValue && searchValue.trim()) {
      let searchValueTemp = searchValue.toLocaleLowerCase();
      const resultList = [];
      data.forEach(item => {
        if (item.title) {
          if (
            item.title.toLocaleLowerCase().indexOf(searchValueTemp) >= 0 ||
            pinyinSingleLetterIndexSearch(searchValueTemp, item.pinyinArr) >=
              0 ||
            item.pinyinArrStr.toLocaleLowerCase().indexOf(searchValueTemp) >= 0
          ) {
            resultList.push(item);
          }
        }
      });
      transferToSectionsData(resultList);
    } else {
      transferToSectionsData(data);
    }
  };

  // rn:触发滚动
  const onSetScrollTo = values => {
    const index = sections.findIndex(item => item.title === values.title);
    if (index > 0) {
      const newArr = sections.slice(0, index);
      console.log(index, "newArr----------- :>> ", newArr);
      let dataArr = [];
      newArr.forEach(element => {
        dataArr = [...dataArr, ...element.data];
        dataArr.concat(element.data);
      });
      console.log("2222222222222222 :>> ", dataArr.length);
      let num = 74 * dataArr.length + index * 14;
      setScrollTo(num);
    }
    if (index === 0) {
      setScrollTo(0);
    }
  };

  const renderList = () => {
    if (sections.length === 0) {
      return <YNoData desc={"No matching data"} />;
    }
    return sections.map((item, index) => {
      return (
        <View
          key={item?.icon || index}
          id={item?.title}
          className="contact-score-item"
        >
          <View className="contact-score-item-sort">{item?.title}</View>
          {item?.data.map((item1, index) => {
            return (
              <View key={item1?.icon || index} className="contact-score-item">
                <YTitleTask
                  showIcon={false}
                  title={
                    <View className="contact-score-item-lf">
                      <View className="contact-score-item-lf-box">
                        <Image
                          className="contact-score-item-lf-box-img"
                          src={item1?.icon || user}
                          mode="aspectFit"
                        />
                      </View>
                      <View
                        className="contact-score-item-lf-cent"
                        numberOfLines={2}
                      >
                        {item1?.title}
                      </View>
                    </View>
                  }
                />
              </View>
            );
          })}
        </View>
      );
    });
  };

  return (
    <View className="contact">
      <View className="contact-top">
        <View className="contact-top-sear">
          <YInputSearch
            className={"contact-top-sear-input"}
            placeholder={"SearchRes"}
            onClearClick={onClearClick}
            onConfirm={onConfirmChange}
            onChange={onChange}
            initialValue={params?.text}
          />
        </View>
        <YTitleTask
          showIcon={false}
          className="contact-top-new"
          title="New Friends"
          right={
            <Image
              className="contact-top-new-img"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pagesUser/chatAdd/index"
                });
              }}
              src={appendImg}
              mode="aspectFit"
            />
          }
        />
      </View>
      <ScrollView
        style={{
          height: windowHeight - 730
        }}
        className="contact-score"
        scrollY
        scrollWithAnimation
        scrollTop={scrollTo}
      >
        {renderList()}
      </ScrollView>
      <Indexes
        data={sections}
        onSetScrollTo={e => {
          onSetScrollTo(e);
        }}
      />
    </View>
  );
};

export default Contact;

const Indexes = props => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const { data = ALPHABETIC, onSetScrollTo } = props;
  const [selected, setSelected] = useState(0);

  useDidShow(() => {
    // setSelected(0);
  });

  const onScrollToAnchor = values => {
    console.log("values :>> ", values);
    if (process.env.TARO_ENV !== "rn" && values) {
      // 找到锚点
      let anchorElement = document.getElementById(values.title);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView({
          block: "start",
          behavior: "smooth",
          inline: "nearest",
          viewOffset: 40
        });
      }
    } else {
      onSetScrollTo(values);
    }
  };

  return (
    <View
      className="contact-score-index"
      style={{
        height: windowHeight - 240
      }}
    >
      {data.map((item, index) => {
        return (
          <View
            key={item?.title || index}
            className={classnames("contact-score-index-text", {
              "contact-score-index-text-active": selected === index
            })}
            onClick={() => {
              setSelected(index);
              onScrollToAnchor(item);
            }}
          >
            {item.title}
          </View>
        );
      })}
    </View>
  );
};
