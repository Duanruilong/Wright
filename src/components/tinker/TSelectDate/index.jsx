import React, { useState } from "react";
import { View, Text, PickerView, PickerViewColumn } from "@tarojs/components";
import { getDate } from "@/utils/utils";
import TMask from "../TMask";
import "./index.scss";

const getIndexFromDate = _date => {
  const date = getDate(_date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const arr = [year - yearMin, month - 1, day - 1, hour, minutes];
  return arr;
};

const yearMin = 2010;
const yearMax = 2030;

const TSelectDate = props => {
  const {
    confirmText = "确认",
    cancelText = "取消",
    title = "选择日期",
    start = "2020/01/01",
    end = "2030/12/31",
    date = Date.now(),
    ...rest
  } = props;
  const index = getIndexFromDate(date);
  const [value, setValue] = useState(index);
  const [selectDate, setSelectDate] = useState(date);

  const years = [];
  const months = [];
  const days = [];
  const hours = [];
  const times = [];

  for (let i = yearMin; i <= yearMax; i++) {
    years.push(i);
  }
  for (let i = 1; i <= 12; i++) {
    months.push(i);
  }
  for (let i = 1; i <= 31; i++) {
    days.push(i);
  }
  for (let i = 0; i <= 23; i++) {
    hours.push(i);
  }
  for (let i = 0; i <= 59; i++) {
    times.push(i);
  }
  const map = [years, months, days, hours, times];

  const onChange = e => {
    console.log("e----onChange--- :>> ", e);
    const dateArr = e.detail.value.map((item, index) => map[index][item]);
    const dateSelect = `${dateArr[0]}/${dateArr[1]}/${dateArr[2]} ${dateArr[3]}:${dateArr[4]}`;
    const date = new Date(dateSelect);
    if (date < getDate(start) || date > getDate(end)) {
      setValue([...value]);
      return;
    }
    setSelectDate(date.getTime());
    setValue(getIndexFromDate(dateSelect, 2020, 2020));
  };

  const onCancel = () => {
    props.onClose && props.onClose();
  };

  const onConfirm = () => {
    props.onConfirm && props.onConfirm(selectDate);
    props.onClose && props.onClose();
  };

  return (
    <TMask {...rest}>
      <View className={"t-select-date"}>
        <View className={"t-select-date-top"}>
          <Text className={"t-select-date-cancel"} onClick={onCancel}>
            {cancelText}
          </Text>
          <Text className={"t-select-date-title"}>{title}</Text>
          <Text className={"t-select-date-confirm"} onClick={onConfirm}>
            {confirmText}
          </Text>
        </View>
        <PickerView
          indicatorStyle={{ height: 60 }}
          style={{ height: 250, width: 100 }}
          value={value}
          onChange={onChange}
        >
          <PickerViewColumn>
            {years.map(item => {
              return (
                <View key={item} className={"t-select-date-item"}>
                  {item}年
                </View>
              );
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {months.map(item => {
              return (
                <View key={item} className={"t-select-date-item"}>
                  {item}月
                </View>
              );
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {days.map(item => {
              return (
                <View key={item} className={"t-select-date-item"}>
                  {item}日
                </View>
              );
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {hours.map(item => {
              return (
                <View key={item} className={"t-select-date-item"}>
                  {item}时
                </View>
              );
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {times.map(item => {
              return (
                <View key={item} className={"t-select-date-item"}>
                  {item}分
                </View>
              );
            })}
          </PickerViewColumn>
        </PickerView>
      </View>
    </TMask>
  );
};

export default TSelectDate;
