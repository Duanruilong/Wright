import { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import score_1 from "@/assets/score_1.png";
import score_2 from "@/assets/score_2.png";
import "./index.scss";

/**
 * YScore 评分-评价
 * @param selected?: 选择的范围数值
 */

const data = [
  { type: score_1 },
  { type: score_1 },
  { type: score_1 },
  { type: score_1 },
  { type: score_1 }
];

const YScore = props => {
  const { selected = 0, disable = true, onClick } = props;
  const [dataScore, setDataScore] = useState(data);

  useEffect(() => {
    const dataArr = [...dataScore];
    if (selected >= 1) {
      for (let index = 0; index < selected; index++) {
        dataArr[index].type = score_2;
      }
      setDataScore(dataArr);
    }
  }, []);

  const onClickScore = values => {
    const dataArr = [...dataScore];
    for (let index = 0; index < dataArr.length; index++) {
      dataArr[index].type = score_1;
      if (index <= values) {
        dataArr[index].type = score_2;
      }
    }
    setDataScore(dataArr);
    onClick(values + 1);
  };

  return (
    <View className={"y-score"}>
      {dataScore.map(({ type }, index) => {
        return (
          <Image
            onClick={() => {
              if (!disable) {
                onClickScore(index);
              }
            }}
            className={"y-score-item"}
            key={index}
            src={type}
          />
        );
      })}
    </View>
  );
};

export default YScore;
