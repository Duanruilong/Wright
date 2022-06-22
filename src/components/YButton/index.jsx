import React, { useState, useRef } from "react";
import { View, Button } from "@tarojs/components";
import classnames from "classnames";
import "./index.scss";

const typeMap = {
  blue: null,
  grey: "y-button-button-grey"
};

/**
 * Button
 * @param className: 样式名
 * @param yType: grey 样式
 * @param loading: 加载动画
 */

const YButton = props => {
  const { current } = useRef({ lastClickTime: 0 });
  const {
    disabled,
    loading,
    className = null,
    children,
    yType = "blue",
    ...rest
  } = props;
  const cls = typeMap[yType];
  const [toClick, setToClick] = useState(false);

  const toButton = () => {
    if (!disabled) {
      const timeNow = Date.now();
      if (timeNow - current.lastClickTime < 200) {
        return;
      }
      current.lastClickTime = timeNow;
      rest.onClick && rest.onClick();
      if (!toClick) {
        setToClick(!toClick);
        setTimeout(() => {
          setToClick(false);
        }, 800);
      }
    }
  };

  return (
    <>
      <Button
        {...rest}
        className={classnames(
          " y-button",
          cls,
          className,
          { "y-button-click": toClick },
          { "y-button-disabled": disabled }
        )}
        onClick={() => {
          toButton();
        }}
      >
        {loading && <View className="y-button-loading" />}
        {children}
      </Button>
    </>
  );
};

export default YButton;
