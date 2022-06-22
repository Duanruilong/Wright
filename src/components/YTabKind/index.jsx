import { useState } from "react";
import { View, ScrollView, Image } from "@tarojs/components";
import screen from "@/assets/screen.png";
import upImg from "@/assets/up.png";
import classnames from "classnames";
import "./index.scss";

/**
 * YTabKind
 * @param data: 数据源
 * @param onChange?: tab选中变化回调
 */

const YTabKind = props => {
  const {
    data,
    onChange,
    onScreen,
    showScree = true,
    total,
    select = 0
  } = props;
  const [tabSelect, setTabSelect] = useState(select);
  const [sort, setSort] = useState(0);

  const onTabClick = (index, sortNew) => {
    setTabSelect(index);
    onChange({ index, sort: sortNew });
  };

  return (
    <View className="tab-kind">
      <ScrollView
        className="tab-kind-scroll"
        scrollX // 横向
        showsHorizontalScrollIndicator={false} // 此属性为true的时候，显示一个水平方向的滚动条。
      >
        {data &&
          data.length > 0 &&
          data.map((item, index) => {
            return (
              <View
                className={"tab-kind-scroll-item"}
                key={item.title}
                onClick={() => {
                  let sortNew = sort;
                  if (item?.icon) {
                    if (sort === -1 || sort === 0) {
                      sortNew = 1;
                    } else {
                      sortNew = -1;
                    }
                    setSort(sortNew);
                  }
                  onTabClick(index, sortNew);
                }}
              >
                <View
                  className={classnames("tab-kind-scroll-item-text", {
                    "tab-kind-scroll-item-text-active": tabSelect === index
                  })}
                >
                  {item.title}
                  &nbsp;{total && tabSelect === index ? `(${total})` : null}
                  {/* icon */}
                  &nbsp;
                  {item?.icon ? (
                    <View className="tab-kind-scroll-item-text-tr">
                      <Image
                        className={classnames(
                          "tab-kind-scroll-item-text-tr-up",
                          {
                            "tab-kind-scroll-item-text-tr-up-act": sort === 1
                          }
                        )}
                        src={upImg}
                        mode="aspectFit"
                        onClick={onScreen}
                      />
                      <Image
                        className={classnames(
                          "tab-kind-scroll-item-text-tr-down",
                          {
                            "tab-kind-scroll-item-text-tr-down-act": sort === -1
                          }
                        )}
                        src={upImg}
                        mode="aspectFit"
                        onClick={onScreen}
                      />
                    </View>
                  ) : null}
                </View>
                <View
                  className={classnames("tab-kind-scroll-item-border", {
                    "tab-kind-scroll-item-border-active": tabSelect === index
                  })}
                />
              </View>
            );
          })}
      </ScrollView>
      {showScree && (
        <Image
          className={"tab-kind-image"}
          src={screen}
          mode="aspectFit"
          onClick={onScreen}
        />
      )}
    </View>
  );
};

export default YTabKind;
