import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-15 11:43:08  * @Desc: 数量加减器  */
const YNumIncrease = props => {
  const { defaultValue = 1, className = "", onChange } = props;

  const [values, setValues] = useState(defaultValue);

  const onAdd = () => {
    const newValue = values + 1;
    setValues(newValue);
    onChange(newValue);
  };
  const onReduce = () => {
    const newValue = values - 1;
    setValues(newValue > 0 ? newValue : 1);
    onChange(newValue > 0 ? newValue : 1);
  };

  return (
    <View className={`y-increase ${className}`}>
      <View
        className="y-increase-red"
        onClick={e => {
          if (process.env.TARO_ENV !== "rn") {
            e.stopPropagation();
          }
          onReduce();
        }}
        onStartShouldSetResponderCapture={ev => true}
      >
        —
      </View>
      <View className="y-increase-value">{values || 1}</View>
      <View
        className="y-increase-add"
        onClick={e => {
          if (process.env.TARO_ENV !== "rn") {
            e.stopPropagation();
          }
          onAdd();
        }}
        onStartShouldSetResponderCapture={ev => true}
      >
        +
      </View>
    </View>
  );
};

export default YNumIncrease;
