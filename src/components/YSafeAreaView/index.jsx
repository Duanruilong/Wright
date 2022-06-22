import { View } from "@tarojs/components";
import "./index.scss";

let SafeAreaView;
if (process.env.TARO_ENV === "rn") {
  SafeAreaView = require("react-native-safe-area-context").SafeAreaView;
}
/**
 * SafeAreaView
 * @param yType: grey 样式
 */

const YSafeAreaView = props => {
  const {
    className = "",
    style = {},
    edges = ["right", "bottom", "left"]
  } = props;
  if (process.env.TARO_ENV === "rn") {
    return (
      <SafeAreaView
        edges={edges}
        mode="padding"
        className={`safe-area-view ${className}`}
        style={style}
      >
        {props.children}
      </SafeAreaView>
    );
  }
  return (
    <View className={`safe-area-view ${className}`} style={{ ...style }}>
      {props.children}
    </View>
  );
};

export default YSafeAreaView;
