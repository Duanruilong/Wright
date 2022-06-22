import { useState } from "react";
import { View, ScrollView, Image } from "@tarojs/components";
import screen from "@/assets/screen.png";
import classnames from "classnames";
import "../index.scss";

/**
 * KindTab
 * @param data: 数据源
 * @param onChange?: tab选中变化回调
 */

const KindTab = props => {
  const { data, onChange, onScreen } = props;
  const [tabSelect, setTabSelect] = useState(0);

  const onTabClick = index => {
    setTabSelect(index);
    onChange(index);
  };

  return (
    <View className="wright-kind">
      <ScrollView
        className="wright-kind-scroll"
        scrollX // 横向
        showsHorizontalScrollIndicator={false} // 此属性为true的时候，显示一个水平方向的滚动条。
      >
        {data &&
          data.length > 0 &&
          data.map((item, index) => {
            return (
              <View
                className={"wright-kind-scroll-item"}
                key={item.title}
                onClick={() => {
                  onTabClick(index);
                }}
              >
                <View className={"wright-kind-scroll-item-text"}>
                  {item.title}
                </View>
                <View
                  className={classnames("wright-kind-scroll-item-border", {
                    "wright-kind-scroll-item-border-active": tabSelect === index
                  })}
                />
              </View>
            );
          })}
      </ScrollView>
      <Image
        className={"wright-kind-image"}
        src={screen}
        mode="aspectFit"
        onClick={onScreen}
      />
    </View>
  );
};

export default KindTab;
