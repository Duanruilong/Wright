import { View, Image } from "@tarojs/components";
import icon from "./no_data.png";
import "./index.scss";

const YNoData = props => {
  const { desc, className = "" } = props;
  return (
    <View className={`y-no-data ${className}`}>
      <Image className={"y-no-data-icon"} src={icon} />
      <View className={"y-no-data-desc"}>{desc}</View>
    </View>
  );
};

export default YNoData;
