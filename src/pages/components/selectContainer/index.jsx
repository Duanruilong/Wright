import React, { useEffect, useRef } from "react";
import { View, Image, PageContainer } from "@tarojs/components";
import Taro, { eventCenter, useDidShow } from "@tarojs/taro";
import YScore from "@/components/YScore";
import YCollection from "@/components/YCollection";
import { isCurrency, conCurrency } from "@/utils/utils";
import "./index.scss";

/**
 * @Author: duanruilong
 * @Date: 2022-04-07 16:28:14
 * @Desc:  SelectContainer 页面容器
 *
 * */

const SelectContainer = props => {
  const { show, position, renderPage, ...rest } = props;

  return (
    <PageContainer show={show} position={position} {...rest}>
      {renderPage}
    </PageContainer>
  );
};

export default SelectContainer;
