import { useState, useEffect, useRef } from "react";
import Taro, { Current } from "@tarojs/taro";
import { View, Image, Picker, Text, Switch, Input } from "@tarojs/components";
import { COUNTRY } from "@/constants";
import YTitleTask from "@/components/YTitleTask";
import YButton from "@/components/YButton";
import rightImg from "@/assets/right.png";
import lookImg from "@/assets/look.png";
import lookNoImg from "@/assets/look_no.png";
import { getStorageData, isEmail } from "@/utils/utils";
import { toast } from "@/utils/tools";
import cn from "./assets/ch.png";
import usa from "./assets/usa.png";
import { getRecommend, changePwd } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: SettingSec
 *  */

const SettingSec = () => {
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userData: {} });
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = () => {
    getStorageData("userInfo").then(values => {
      current.userData = values;
      setUserInfo(values);
    });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View className="setting-sec">
      {params?.type === "r" && <Region userInfo={userInfo} />}
      {params?.type === "n" && <Notin userInfo={userInfo} />}
      {params?.type === "p" && <Password userInfo={userInfo} />}
    </View>
  );
};

export default SettingSec;

/**  * @Author: duanruilong  * @Date: 2022-04-24 15:06:38  * @Desc: Region  */
const Region = ({ userInfo }) => {
  console.log("userInfo :>> ", userInfo);
  const reasonsPicker = ["usa", "ch"];
  const langPicker = ["English", "Chines"];

  const [seReg, setSeReg] = useState(userInfo?.region);

  const [seLang, setSeLang] = useState(userInfo?.country);

  useEffect(() => {}, [userInfo]);

  const getImg = value => {
    const imgData = {
      usa: usa,
      ch: cn
    };
    if (value) {
      return imgData[value];
    }
  };

  // TODO:
  const onChange = () => {
    getRecommend({
      userid: userInfo.userid
    }).then(res => {
      console.log("res :>> ", res);
      toast("Success");
    });
  };

  return (
    <>
      <Picker
        mode="selector"
        range={reasonsPicker}
        onChange={e => {
          setSeReg(reasonsPicker[e.detail.value]);
        }}
      >
        <YTitleTask
          className="setting-sec-item"
          title="Region"
          showIcon={false}
          right={
            <View className="setting-sec-item-rt">
              <Image
                className="setting-sec-item-rt-img"
                src={getImg(seReg)}
                mode="aspectFit"
              />
              <Text className="setting-sec-item-rt-tex">
                {seReg || "Please select"}
              </Text>
              <Image
                className="setting-sec-item-rt-img"
                src={rightImg}
                mode="aspectFit"
              />
            </View>
          }
        />
      </Picker>
      <Picker
        mode="selector"
        range={langPicker}
        onChange={e => {
          setSeLang(langPicker[e.detail.value]);
        }}
      >
        <YTitleTask
          className="setting-sec-item"
          title="Language"
          showIcon={false}
          right={
            <View className="setting-sec-item-rt">
              <Text className="setting-sec-item-rt-tex">
                {seLang || "Please select"}
              </Text>
              <Image
                className="setting-sec-item-rt-img"
                src={rightImg}
                mode="aspectFit"
              />
            </View>
          }
        />
      </Picker>
    </>
  );
};

/**  * @Author: duanruilong  * @Date: 2022-04-24 15:06:38  * @Desc: Notin  */
const Notin = ({ userInfo }) => {
  console.log("userInfo :>> ", userInfo);
  const [remind, setRemind] = useState(userInfo?.remind);
  const [orders, setOrders] = useState(userInfo?.orders);
  const [recommend, setRecommend] = useState(userInfo?.recommend);

  useEffect(() => {}, [userInfo]);

  // TODO:
  const onChange = () => {
    // getRecommend({
    //   userid: userInfo.userid
    // }).then(res => {
    //   console.log("res :>> ", res);
    //   toast("Success");
    // });
  };

  return (
    <>
      <YTitleTask
        className="setting-sec-item"
        title="System Reminders"
        showIcon={false}
        right={
          <View className="setting-sec-item-notion">
            <Switch
              color="#84D3BE"
              checked={remind}
              onChange={e => {
                console.log("e :>> ", e);
                const values = e.detail.value;
                onChange();
                setRemind(values);
              }}
            />
          </View>
        }
      />
      <YTitleTask
        className="setting-sec-item"
        title="You Orders"
        showIcon={false}
        right={
          <View className="setting-sec-item-notion">
            <Switch
              color="#84D3BE"
              checked={orders}
              onChange={e => {
                console.log("e :>> ", e);
                const values = e.detail.value;
                onChange();
                setOrders(values);
              }}
            />
          </View>
        }
      />
      <YTitleTask
        className="setting-sec-item"
        title="Recommend"
        showIcon={false}
        right={
          <View className="setting-sec-item-notion">
            <Switch
              color="#84D3BE"
              checked={recommend}
              onChange={e => {
                console.log("e :>> ", e);
                const values = e.detail.value;
                onChange();
                setRecommend(values);
              }}
            />
          </View>
        }
      />
    </>
  );
};

/**  * @Author: duanruilong  * @Date: 2022-04-24 15:06:38  * @Desc: Password  */
const Password = ({ userInfo }) => {
  console.log("userInfo :>> ", userInfo);
  const [passDta, setPassDta] = useState();

  useEffect(() => {}, [userInfo]);

  const onSubmit = () => {
    console.log("222 :>> ", passDta);

    if (!passDta) {
      return toast(`Please enter Current Password`);
    }
    if (isEmail(passDta.new) || isEmail(passDta.confirm)) {
      return toast(`Please enter New Password`);
    }

    changePwd({
      loginname: userInfo?.email,
      // verifyCode: code,
      pwd: passDta.new
    }).then(res => {
      toast("Password modified successfully");
    });
  };

  return (
    <>
      <View className="setting-sec-pass">
        <View className="setting-sec-pass-cent">
          <YTitleTask
            className="setting-sec-pass-cent-item"
            title="Current"
            showIcon={false}
            right={
              <View className="setting-sec-pass-cent-item-rt">
                <Input
                  className="setting-sec-pass-cent-item-rt-tex"
                  placeholder="Please enter Current Password"
                  value={passDta?.current}
                  onInput={e => {
                    const values = e.detail.value;
                    const newArr = { ...passDta };
                    newArr.current = values;
                    setPassDta(newArr);
                  }}
                />
                {/* <Image
                  className="setting-sec-pass-cent-item-rt-img"
                  src={lookImg}
                  mode="aspectFit"
                /> */}
              </View>
            }
          />
          <YTitleTask
            className="setting-sec-pass-cent-item"
            title="New"
            showIcon={false}
            right={
              <View className="setting-sec-pass-cent-item-rt">
                <Input
                  className="setting-sec-pass-cent-item-rt-tex"
                  placeholder="Please enter New Password"
                  value={passDta?.new}
                  onInput={e => {
                    const values = e.detail.value;
                    const newArr = { ...passDta };
                    newArr.new = values;
                    setPassDta(newArr);
                  }}
                />
                {/* <Image
                  className="setting-sec-pass-cent-item-rt-img"
                  src={lookImg}
                  mode="aspectFit"
                /> */}
              </View>
            }
          />
          <YTitleTask
            className="setting-sec-pass-cent-item"
            title="Confirm"
            showIcon={false}
            right={
              <View className="setting-sec-pass-cent-item-rt">
                <Input
                  className="setting-sec-pass-cent-item-rt-tex"
                  placeholder="Please type New Password again"
                  value={passDta?.confirm}
                  onInput={e => {
                    const values = e.detail.value;
                    const newArr = { ...passDta };
                    newArr.confirm = values;
                    setPassDta(newArr);
                  }}
                />
                {/* <Image
                  className="setting-sec-pass-cent-item-rt-img"
                  src={lookImg}
                  mode="aspectFit"
                /> */}
              </View>
            }
          />
          <View className="setting-sec-pass-cent-col"></View>
          <YTitleTask
            className="setting-sec-pass-cent-item"
            title="Forget My Password"
            onClick={() => {
              Taro.navigateTo({
                url: "/pagesUser/updatePassword/index"
              });
            }}
          />
        </View>
        {/* button */}
        <View className="setting-sec-pass-but">
          <YButton
            yType="default"
            onClick={() => {
              onSubmit();
            }}
          >
            <View className="setting-sec-pass-but-cent">Reset Password</View>
          </YButton>
        </View>
      </View>
    </>
  );
};
