import { useState, useEffect } from "react";
import { View, Input, Image } from "@tarojs/components";
import classnames from "classnames";
import { toast } from "@/utils/tools";
import imgClose from "./close1.png";
import imError from "./error.png";
import "./index.scss";

/**
 * Input
 * @param disabled: 是否禁用
 * @param className: 样式名
 * @param title: 左侧显示内容
 * @param error: 是否出现错误
 * @param clear: 清除内容
 * @param right: 自定义右侧内容
 * @param value: 输入框的值
 * @param onErrorClick: 出现错误点击事件回调
 */

const YInput = props => {
  const {
    className = null,
    error,
    title,
    right,
    style,
    clear,
    value,
    onErrorClick,
    onClearClick,
    onInput,
    ...rest
  } = props;

  const [clearValue, setClearValue] = useState(false);

  useEffect(() => {
    if (!value) {
      // setClearValue(true);
    }
  }, [value]);

  const toOnInput = e => {
    onInput && onInput(e);
  };
  const handleClearValue = async e => {
    // e.detail.value = undefined;
    await setClearValue(true);
    onInput && onInput(e);
    setClearValue(false);
    onClearClick();
  };

  return (
    <View
      className={classnames("y-input", className, {
        "y-input-error": error
      })}
      style={style}
    >
      {title && (
        <View className={`y-input-title ${error && "y-input-title-error"}`}>
          {title}
        </View>
      )}
      {clearValue ? (
        <View></View>
      ) : (
        <Input
          className={classnames("y-input-input", className, {
            "y-input-error": error
          })}
          // maxlength={20}
          onInput={toOnInput}
          value={value}
          {...rest}
        />
      )}

      {error && (
        <Image
          className="y-input-cloison"
          onClick={() => {
            onErrorClick && onErrorClick();
          }}
          src={imError}
        />
      )}
      {clear && value && (
        <Image
          className={"y-input-cloison"}
          src={imgClose}
          onClick={handleClearValue}
        />
      )}
      {right}
    </View>
  );
};

export default YInput;
