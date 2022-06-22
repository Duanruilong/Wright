import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
  useRef
} from "react";
import { View, ScrollView } from "@tarojs/components";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-07 10:26:24
 *  @Desc:  YListView
 **/

const YListView = forwardRef((props, ref) => {
  const {
    renderList,
    renderInitLoading,
    request,
    ps = 20,
    extraParams = {},
    manual = false,
    onRefresh,
    classStyle,
    ...rest
  } = props;

  const { current } = useRef({ params: { ...extraParams, pn: 1, ps } });
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const [data, setData] = useState();
  const [pullUpIng, setPullUpIng] = useState(false);
  const moreData = data && data.records && data.tc > data.records.length;
  const loadingText = pullUpIng ? "Loading..." : "";

  const getData = (opts, callback) => {
    current.params = { ...current.params, ...opts };
    request(current.params)
      .then(res => {
        if (res.pn > 1) {
          setData({
            ...res,
            records: (data.records || []).concat(res.records || [])
          });
        } else {
          setData(res);
        }
        current.params.pn = (res.pn || 1) + 1;
        callback && callback(res);
      })
      .catch(() => {});
  };

  const onRefresherRefresh = () => {
    setRefresherTriggered(true);
    getData({ pn: 1 }, () => {
      setRefresherTriggered(false);
    });
    onRefresh && onRefresh();
  };

  const onPullUp = () => {
    console.log(pullUpIng, "onPullUp----222 :>> ", moreData);

    if (!moreData || pullUpIng) {
      return;
    }
    setPullUpIng(true);
    getData({}, () => {
      setPullUpIng(false);
    });
  };

  useEffect(() => {
    if (!manual) {
      getData({ pn: 1 });
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      load: (opts = {}, callBack) => {
        getData({ pn: 1, ...opts }, callBack);
      }
    }),
    []
  );

  return (
    <ScrollView
      className={classStyle}
      scrollY
      refresherEnabled
      refresherTriggered={refresherTriggered}
      lowerThreshold={100}
      scrollWithAnimation
      onRefresherRefresh={onRefresherRefresh}
      onScrollToLower={onPullUp}
      refresherBackground={"#F3F5F8"}
      {...rest}
    >
      {!data && renderInitLoading && renderInitLoading()}
      {data && renderList(data)}
      {/* <View className={"y-list-view-more"}>{loadingText}</View> */}
    </ScrollView>
  );
});

export default YListView;
