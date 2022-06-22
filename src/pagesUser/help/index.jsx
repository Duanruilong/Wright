import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import YTitleTask from "@/components/YTitleTask";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: Help
 *  */

const Help = () => {
  // useEffect(() => {}, []);

  return (
    <View className="help">
      <YTitleTask
        className="help-history"
        title="FAQ"
        onClick={() => {
          Taro.navigateTo({ url: "/pagesUser/helpSec/index?type=q" });
        }}
      />
      <YTitleTask
        className="help-history"
        title="Feedback & Complaint"
        onClick={() => {
          Taro.navigateTo({ url: "/pagesUser/helpSec/index?type=f" });
        }}
      />
    </View>
  );
};

export default Help;
