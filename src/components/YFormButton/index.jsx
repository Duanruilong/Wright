import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

const YFormButton = props => {
  const {
    className,
    right,
    tag,
    label,
    disabled,
    defaultValue,
    placeholder,
    onClick
  } = props;

  const buttonRender = () => {
    const cls = defaultValue ? "y-form-button-button-active" : "";
    return (
      <View
        className={`y-form-button-button ${cls}`}
        onClick={disabled ? null : onClick}
      >
        {!disabled && tag}
        <View className={"y-form-button-button-text"}>
          {defaultValue || placeholder}
        </View>
        {!disabled && right}
      </View>
    );
  };
  return (
    <View className={`y-form-button ${className}`}>
      {label && <View className={"y-form-button-label"}>{label}</View>}
      {buttonRender()}
    </View>
  );
};

export default YFormButton;
