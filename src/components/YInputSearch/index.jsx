import React, { useState, useReducer } from "react";
import { View, Image } from "@tarojs/components";
import YInput from "@/components/YInput";
import { debounce } from "@/utils/utils";
import imgSearch from "./search.png";
import "./index.scss";

function reducer(state, action) {
  return { ...state, ...action };
}

/**  * @Author: duanruilong  * @Date: 2022-04-07 16:28:14  * @Desc:  YInputSearch */

const YInputSearch = props => {
  const {
    className = "",
    style,
    placeholder,
    initialValue,
    onChange,
    onClearClick,
    right,
    ...rest
  } = props;

  const [{ value }, dispatch] = useReducer(reducer, {
    value: initialValue
  });

  const request = debounce(value => {
    onChange && onChange(value);
  }, 500);

  const onInput = e => {
    const searchValue = e.detail?.value || undefined;
    dispatch({
      value: searchValue
    });
    request(searchValue);
  };

  return (
    <View className={`y-input-search ${className}`} style={style}>
      <Image className={"y-input-search-icon"} src={imgSearch} />
      <YInput
        controlled
        clear
        placeholder={placeholder}
        type={"text"}
        className={"y-input-search-input"}
        value={value}
        onInput={onInput}
        onClearClick={onClearClick}
        {...rest}
      />
      {right}
    </View>
  );
};

export default YInputSearch;
