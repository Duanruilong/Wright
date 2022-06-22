import { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import collection_no from "@/assets/collection_no.png";
import collection_yes from "@/assets/collection_yes.png";
import { COUNTRY } from "@/constants";
import { toast } from "@/utils/tools";
import { getLike, getUnlike } from "./service";
import "./index.scss";

/**
 * YCollection 收藏与取消收藏
 * @param selected?: 选中状态
 * @param recommendId?: 推荐商品id
 */

const YCollection = props => {
  const { like = 0, recommendId, style, onChange } = props;
  const [selected, setSelected] = useState(like);

  useEffect(() => {
    if (props.like !== undefined && props.like !== null) {
      setSelected(props.like);
    }
  }, [props.like]);

  // 收藏
  const onLike = () => {
    getLike({
      country: COUNTRY,
      recommendid: recommendId
    })
      .then(res => {
        toast("Collection success");
        setSelected(1);
        onChange(1);
      })
      .catch(() => {});
  };

  // 取消收藏
  const onUnlike = () => {
    getUnlike({
      country: COUNTRY,
      recommendid: recommendId
    })
      .then(res => {
        toast("Cancel collection successfully");
        setSelected(0);
        onChange(0);
      })
      .catch(() => {});
  };

  const onColChange = index => {
    // console.log(index, "onChange :>> ", selected);
    if (index === 1) {
      // 已收藏
      onUnlike();
    } else {
      // 未收藏
      onLike();
    }
  };

  return (
    <Image
      style={style}
      className={"y-collection"}
      onStartShouldSetResponderCapture={ev => true}
      onClick={e => {
        if (process.env.TARO_ENV !== "rn") {
          e.stopPropagation();
        }
        onColChange(selected);
      }}
      src={selected === 1 ? collection_yes : collection_no}
    />
  );
};

export default YCollection;
