import { useState } from "react";
import { View, ScrollView, Image } from "@tarojs/components";
import screen from "@/assets/screen.png";
import classnames from "classnames";
import "./index.scss";

/**
 * KindTab
 * @param data: 数据源
 * @param onChange?: tab选中变化回调
 */

const KindTab = props => {
  const { data, onChange, onScreen, showScree = true, total } = props;
  const [tabSelect, setTabSelect] = useState(0);

  const onTabClick = index => {
    setTabSelect(index);
    onChange(index);
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
                  onTabClick(index);
                }}
              >
                <View
                  className={classnames("tab-kind-scroll-item-text", {
                    "tab-kind-scroll-item-text-active": tabSelect === index
                  })}
                >
                  {item.title}
                  &nbsp;{total && tabSelect === index ? `(${total})` : null}
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

export default KindTab;
