import React, { useState, useRef } from "react";
import { View, Picker } from "@tarojs/components";
import { formatDate, getDate } from "@/utils/utils";
import YFormButton from "@/components/YFormButton";
import YArrow from "@/components/YArrow";

const YPickerTimeRange = props => {
  const { disabled, placeholder, label } = props;
  const { current } = useRef({
    startDate: props.start
      ? formatDate(props.start, "yyyy-MM-dd")
      : "2020-01-01",
    nowDate: formatDate(new Date(), "yyyy-MM-dd"),
    nowTime: formatDate(new Date(), "hh:mm"),
    maxTime: formatDate(new Date(), "hh:mm")
  });
  const [date, setDate] = useState(
    props.startTime ? formatDate(props.date, "yyyy-MM-dd") : null
  );
  const [startTime, setStartTime] = useState(
    props.startTime ? formatDate(props.startTime, "hh:mm") : null
  );
  const [endTime, setEndTime] = useState(
    props.endTime ? formatDate(props.endTime, "hh:mm") : null
  );

  const onChange = options => {
    const data = { date, startTime, endTime, ...options };
    if (options.date) {
      if (options.date < current.nowDate) {
        current.maxTime = "23:59";
      } else {
        if (data.startTime > current.nowTime) {
          data.startTime = null;
        }
        if (data.endTime > current.nowTime) {
          data.endTime = null;
        }
        current.maxTime = current.nowTime;
      }
    }
    setDate(data.date);
    setStartTime(data.startTime);
    setEndTime(data.endTime);
    props.onChange &&
      props.onChange({
        date: data.date ? getDate(data.date).getTime() : null,
        startTime:
          data.startTime && data.date
            ? getDate(`${data.date} ${data.startTime}`).getTime()
            : null,
        endTime:
          data.endTime && data.date
            ? getDate(`${data.date} ${data.endTime}`).getTime()
            : null
      });
  };

  return (
    <View>
      <Picker
        disabled={disabled}
        mode="date"
        value={date || current.nowDate}
        start={current.startDate}
        end={current.nowDate}
        onChange={e => {
          onChange({ date: e.detail.value });
        }}
      >
        <YFormButton
          disabled={disabled}
          label={label}
          placeholder={placeholder}
          defaultValue={date}
          right={<YArrow.Down />}
        />
      </Picker>
      <Picker
        disabled={disabled}
        mode="time"
        value={startTime || current.nowTime}
        start="00:00"
        end={current.maxTime}
        onChange={e => {
          onChange({ startTime: e.detail.value });
        }}
      >
        <YFormButton
          disabled={disabled}
          label={"开始时间"}
          placeholder={"请选择开始时间"}
          defaultValue={startTime}
          right={<YArrow.Down />}
        />
      </Picker>
      <Picker
        disabled={disabled}
        mode="time"
        value={endTime || current.nowTime}
        start="00:00"
        end={current.maxTime}
        onChange={e => {
          onChange({ endTime: e.detail.value });
        }}
      >
        <YFormButton
          disabled={disabled}
          label={"结束时间"}
          placeholder={"请选择结束时间"}
          defaultValue={endTime}
          right={<YArrow.Down />}
        />
      </Picker>
    </View>
  );
};

export default YPickerTimeRange;
