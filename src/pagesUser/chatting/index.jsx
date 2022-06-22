import { useState, useRef } from "react";
import Taro, { Current, useDidShow } from "@tarojs/taro";
import { View, Image, ScrollView, Textarea } from "@tarojs/components";
import YTitleTask from "@/components/YTitleTask";
import { ALPHABETIC, COUNTRY, EMOJIS } from "@/constants";
import YNoData from "@/components/YNoData";
import TMask from "@/components/tinker/TMask";
import { formatDate, getStorageData, isEmpty } from "@/utils/utils";
import user from "@/assets/use_img1.png";
import sound from "@/assets/sound.png";
import add from "@/assets/add.png";
import camera from "@/assets/camera.png";
import commodity from "@/assets/commodity.png";
import images from "@/assets/images.png";
import QR_code from "@/assets/QR_code.png";
import gift from "@/assets/gift.png";
import use_card from "@/assets/use_card.png";
import expression from "@/assets/expression.png";
import left_san from "@/assets/left_san.png";
import right_san from "@/assets/right_san.png";
import { toast } from "@/utils/tools";
import "./index.scss";
import { getRecommend } from "./service";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: Chatting
 *  */

const moreData = [
  { title: "Item", type: "item", icon: commodity },
  { title: "Picture", type: "pic", icon: images },
  { title: "Camera", type: "camera", icon: camera },
  { title: "My QR", type: "qr", icon: QR_code },
  { title: "Gift Card", type: "gift", icon: gift },
  { title: "Name Card", type: "card", icon: use_card }
];

const Chatting = () => {
  const inputEle = useRef(null);
  const ScrollViewRN = useRef(null);
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userData: {}, returnText: "", setScrollToY: 0 });
  const [data, setData] = useState([]);
  const [textValue, setTextValue] = useState();
  const [showMore, setShowMore] = useState(false);
  const [moreType, setMoreType] = useState("card");
  const [scrollInto, setScrollInto] = useState();
  const [scrollToY, setScrollToY] = useState();

  const getUserInfo = async () => {
    const use = await getStorageData("userInfo");
    current.userData = use;
  };

  // 获取数据
  const onListData = value => {
    getRecommend({
      country: COUNTRY,
      kindid: 1,
      type: 1
    }).then(res => {
      const newArr = [...data, { type: "time", value: new Date().getTime() }];
      setData([...newArr, ...res?.data] || []);
    });
  };

  // useEffect(() => {}, []);

  useDidShow(() => {
    Taro.setNavigationBarTitle({
      title: params.id
    });
    // 清除临时缓存数据
    getUserInfo();
    onListData();
  });

  const onShowMoreItem = values => {
    console.log("onShowMoreItem :>> ", values);
    toast(values.type);
    if (values.type === "pic") {
      choosePicClick();
    }
  };

  // pic
  const choosePicClick = async () => {
    const { tempFilePaths } = await Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album"]
    });
    console.log("choosePicClick :>> ", tempFilePaths[0]);
    const newArr = [...data];
    setData([
      ...newArr,
      {
        buy: 0,
        comments: 4,
        descript: (
          <Image
            className={"chat-ing-score-item-rt-cent-img"}
            src={tempFilePaths[0]}
            mode="aspectFit"
          />
        ),
        islike: 1,
        originprice: 1200,
        price: 600,
        recommendid: new Date().getTime(),
        title: "Garbage",
        type: 1,
        unit: 1
      }
    ]);
  };

  const onClickEmoItem = values => {
    console.log("this.inputEle :>> ", inputEle?.current);
    let text = values.src;
    if (textValue) {
      text = textValue + `${text} `;
    }
    setTextValue(text);
  };

  const onClickSend = () => {
    console.log("onClickSend :>> ", textValue);
    const newArr = [...data];
    setData([
      ...newArr,
      {
        buy: 0,
        comments: 4,
        descript: textValue,
        islike: 1,
        originprice: 1200,
        price: 600,
        recommendid: new Date().getTime(),
        title: "Garbage",
        type: 1,
        unit: 1
      }
    ]);
    setTimeout(() => {
      setTextValue("");
      setScrollInto(`scr_${data.length}`);
      setScrollToY(
        current.setScrollToY > 1 ? current.setScrollToY : data.length * 500
      );
      // inputEle.onFocus();
    }, 600);
  };

  const renderList = () => {
    console.log("data -----:>> ", data);
    if (data.length === 0) {
      return <YNoData desc={"No Chat"} />;
    }
    return data.map((item, index) => {
      return (
        <View
          key={index}
          id={`scr_${index}`}
          onClick={() => {
            // onItemGoods(item);
          }}
          className="chat-ing-score-item"
        >
          {item.type === "time" ? (
            <View className="chat-ing-score-item-tim">
              {formatDate(item?.value, "yyyy-MM-dd hh:mm")}
            </View>
          ) : (
            <ChatList index={index} data={item} />
          )}
        </View>
      );
    });
  };

  return (
    <View className="chat-ing">
      <ScrollView
        style={{
          height: windowHeight - 730
        }}
        className={`chat-ing-score ${showMore && "chat-ing-score-more"}`}
        scrollY
        scrollWithAnimation
        scrollIntoView={scrollInto}
        scrollTop={scrollToY}
        onContentSizeChange={(contentWidth, contentHeight) => {
          console.log("contentHeight :>> ", contentHeight);
        }}
        onScroll={e => {
          current.setScrollToY = e.detail.scrollHeight;
        }}
        ref={ScrollViewRN}
      >
        {renderList()}
      </ScrollView>
      <View className="chat-ing-but">
        {/* <Image
          className="chat-ing-but-image"
          onClick={() => {
            Taro.navigateBack();
          }}
          src={sound}
          mode="aspectFit"
        /> */}
        <View className="chat-ing-but-top">
          <View className="chat-ing-but-top-int">
            <Textarea
              style="height:30px; width:200px;margin:6px 12px;font-size: 16px;letter-spacing: 1px;"
              maxlength={600}
              ref={inputEle}
              id="textarea"
              allowClear
              // focus
              className="chat-ing-but-top-int-text"
              value={textValue}
              adjustPosition
              onInput={e => {
                console.log("e :>> ", e);
                const returnText = e.detail?.value;
                setTextValue(returnText);
              }}
              onConfirm={e => {
                console.log("e onConfirm:>> ", e);
              }}
              onBlur={e => {}}
              showConfirmBar
              onFocus={e => {
                // let element = inputEle.textAreaRef; //获取dom节点实例
                // let CaretPos = {
                //   start: 0,
                //   end: 0
                // };
                // if (inputEle?.resizableTextArea?.textArea.selectionStart) {
                //   CaretPos.start =
                //     inputEle?.resizableTextArea?.textArea.selectionStart;
                // }
                // if (inputEle?.resizableTextArea?.textArea.selectionEnd) {
                //   CaretPos.end =
                //     inputEle?.resizableTextArea?.textArea.selectionEnd;
                // }
                // console.log(CaretPos, "object :>> ", inputEle);
                setShowMore(false);
                setTimeout(() => {
                  setScrollInto(`scr_${data.length - 1}`);
                  setScrollToY(
                    current.setScrollToY > 1
                      ? current.setScrollToY
                      : data.length * 200
                  );
                }, 600);
                if (process.env.TARO_ENV !== "rn") {
                  e.stopPropagation();
                }

                if (isEmpty(textValue)) {
                  return;
                }
              }}
            />
          </View>
          <Image
            className="chat-ing-but-top-image"
            onClick={() => {
              setShowMore(!showMore);
              setMoreType("emo");
            }}
            src={expression}
            mode="aspectFit"
          />
          {textValue ? (
            <View
              className="chat-ing-but-top-sen"
              onClick={() => {
                setShowMore(false);
                onClickSend();
              }}
            >
              Send
            </View>
          ) : (
            <Image
              className="chat-ing-but-top-image"
              onClick={() => {
                setShowMore(!showMore);
                setMoreType("card");
              }}
              src={add}
              mode="aspectFit"
            />
          )}
        </View>

        {showMore && (
          <MoreList
            type={moreType}
            onClickItem={e => {
              onShowMoreItem(e);
            }}
            onClickEmoItem={e => {
              onClickEmoItem(e);
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Chatting;

/**
 *  @Author: duanruilong
 *  @Date: 2022-05-06 10:23:37
 *  @Desc: ChatList
 *  */

const ChatList = props => {
  const { index, data } = props;
  return index % 2 === 0 ? (
    <View className="chat-ing-score-item-lf">
      <View className="chat-ing-score-item-lf-box">
        <Image
          className="chat-ing-score-item-lf-box-img"
          onClick={() => {
            Taro.navigateBack();
          }}
          src={user}
          mode="aspectFit"
        />
      </View>
      <View className="chat-ing-score-item-lf-cent">
        {data?.descript}
        <View className="chat-ing-score-item-lf-cent-san">
          <Image
            className="chat-ing-score-item-lf-cent-san-img"
            src={left_san}
            mode="aspectFit"
          />
        </View>
      </View>
    </View>
  ) : (
    <View className="chat-ing-score-item-rt">
      <View className="chat-ing-score-item-rt-cent">
        {data?.descript}
        <View className="chat-ing-score-item-rt-cent-san">
          <Image
            className="chat-ing-score-item-rt-cent-san-img"
            src={right_san}
            mode="aspectFit"
          />
        </View>
      </View>
      <View className="chat-ing-score-item-rt-box">
        <Image
          className="chat-ing-score-item-rt-box-img"
          onClick={() => {
            Taro.navigateBack();
          }}
          src={user}
          mode="aspectFit"
        />
      </View>
    </View>
  );
};

/**
 * @Author: duanruilong
 * @Date: 2022-05-06 13:50:44
 * @Desc: more-about-EMOJIS
 */

const MoreList = props => {
  const { type, onClickItem, onClickEmoItem } = props;

  if (type === "card") {
    return (
      <View className="chat-ing-but-more">
        {moreData.map((item, index) => {
          return (
            <View
              key={index}
              onClick={() => {
                onClickItem(item);
              }}
              className="chat-ing-but-more-item"
            >
              <Image
                className="chat-ing-but-more-item-img"
                src={item?.icon}
                mode="aspectFit"
              />
              <View className="chat-ing-but-more-item-tit">{item?.title}</View>
            </View>
          );
        })}
      </View>
    );
  } else {
    return (
      <ScrollView
        style={{
          height: 260
        }}
        className="chat-ing-but-sco"
        scrollWithAnimation
      >
        <View className="chat-ing-but-sco-item">
          {EMOJIS.map((item, index) => {
            return (
              <View
                key={index}
                onClick={() => {
                  onClickEmoItem(item);
                }}
                className="chat-ing-but-sco-item-meo"
              >
                <View className="chat-ing-but-sco-item-meo-img">
                  {item?.src}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return null;
};
