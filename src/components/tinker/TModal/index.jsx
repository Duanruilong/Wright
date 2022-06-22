import React from "react";
import { View, Text } from "@tarojs/components";
import TMask from "../TMask";
import "./index.scss";

const TModal = props => {
  const {
    title,
    content,
    footer,
    confirmText = "确认",
    cancelText = "取消",
    ...rest
  } = props;

  const onCancel = () => {
    props.onCancel && props.onCancel();
    props.onClose && props.onClose();
  };

  const onConfirm = () => {
    props.onConfirm && props.onConfirm();
  };

  const renderFooter = () => {
    if (footer) {
      return <View className={"t-modal-footer"}>{footer}</View>;
    }
    if (footer !== null) {
      return (
        <View className={"t-modal-footer"}>
          {cancelText && (
            <View className={"t-modal-footer-button"} onClick={onCancel}>
              {cancelText}
            </View>
          )}
          {confirmText && (
            <View
              className={"t-modal-footer-button t-modal-footer-button-active"}
              onClick={onConfirm}
            >
              {confirmText}
            </View>
          )}
        </View>
      );
    }
  };
  return (
    <TMask {...rest}>
      <View className={"t-modal"}>
        {title && <View className={"t-modal-title"}>{title}</View>}
        {content && <View className={"t-modal-content"}>{content}</View>}
        {renderFooter()}
      </View>
    </TMask>
  );
};

export default TModal;
