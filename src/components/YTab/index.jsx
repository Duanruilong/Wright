import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import classnames from "classnames";
import "./index.scss";

/**
 * tab标签
 * @param data: 数据源
 * @param selected?: 当前选中tab
 * @param defaultSelected?: 默认选中tab
 * @param onChange?: tab选中变化回调
 */

const YTab = props => {
  const { data, defaultSelected = 0 } = props;
  const [selected, setSelected] = useState(defaultSelected);

  useEffect(() => {
    if (props.selected !== undefined && props.selected !== null) {
      setSelected(props.selected);
    }
  }, [props.selected]);

  const onChange = index => () => {
    if (index === selected) {
      return;
    }
    setSelected(index);
    props.onChange && props.onChange(index, data[index]);
  };

  return (
    <View className={"y-tab"}>
      {data.map(({ value }, index) => {
        const cls = classnames("y-tab-item", {
          "y-tab-item-active": selected === index
        });
        return (
          <View className={cls} onClick={onChange(index)} key={index}>
            {value}
            <View
              className={classnames("y-tab-item-border", {
                "y-tab-item-border-active": selected === index
              })}
            />
          </View>
        );
      })}
    </View>
  );
};

export default YTab;
