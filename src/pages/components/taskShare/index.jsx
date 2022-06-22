import React, { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
// import Taro from '@tarojs/taro';
import TMask from "@/components/tinker/TMask";
import closeImg from "@/assets/close.png";
import shareImg from "@/assets/to_share_white.png";
import { getGoodsInfo } from "./service";
import "./index.scss";

const ShareData = {
  tips: "分享给,医生吧",
  title: "医生扫码后可以直接查看素材",
  button: "长按图片分享给医生",
  page: "pages/learn/learnDetail/index",
  system: "DOCTOR", //二维码所属小程序 （REPRESENT-代表端、DOCTOR-医生端）
  type: "DOCTOR_LEARN_PLAN"
};

const TaskShare = props => {
  const { showButton = true, showModal = "", id, scene } = props;
  const [show, setShow] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [imgURL, setImgURL] = useState("");

  const getGoodsInfo = () => {};

  useEffect(() => {
    console.log("props :>> ", props);
    setTimeout(() => {
      setShowTips(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (showModal) {
      getGoodsInfo();
    }
  }, [showModal]);

  return (
    <View className="share">
      {showButton && (
        <View
          className="share-but"
          onClick={() => {
            setShow(true);
          }}
        >
          <Image src={shareImg} className="share-but-img" />
        </View>
      )}
      <TMask visible={show}>
        <View className="share-mask">
          <View className="share-mask-center">4444</View>
          <Image
            onClick={() => {
              setShow(false);
              props.onClose && props.onClose();
            }}
            src={closeImg}
            className="share-mask-close"
          />
        </View>
      </TMask>
    </View>
  );
};

export default TaskShare;
