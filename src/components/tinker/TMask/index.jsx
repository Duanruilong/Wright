import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

const TMask = props => {
  const { className = "", visible, children } = props;

  const onMaskClick = () => {
    props.onMaskClick && props.onMaskClick();
    props.onClose && props.onClose();
  };

  return (
    <>
      {visible ? (
        <View className={`t-mask ${className}`} onClick={onMaskClick}>
          {children}
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default TMask;
