import { useState, useEffect, useRef } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Image, Picker, Input } from "@tarojs/components";
import user from "@/assets/user_img.png";
import QR_code from "@/assets/QR_code.png";
import YTitleTask from "@/components/YTitleTask";
import YInput from "@/components/YInput";
import YButton from "@/components/YButton";
import YPickerTimeRange from "@/components/YPickerTimeRange";
import { MAP_SEX } from "@/constants";
import { getStorageData, getDate, formatDate } from "@/utils/utils";
import "./index.scss";

/**  * @Author: duanruilong  * @Date: 2022-04-11 14:11:59  * @Desc: Profile  */

const Profile = () => {
  const { current } = useRef({
    userData: {},
    nowDate: formatDate(new Date(), "yyyy-MM-dd")
  });
  const [userInfo, setUserInfo] = useState();
  // const [clerkData, setClerkData] = useState();

  const getUserInfo = async () => {
    let data = await getStorageData("userInfo");
    const sexData = MAP_SEX.find(({ code }) => code === data?.gender);
    data.gender_name = sexData.value;
    current.userData = data;
    setUserInfo(data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useDidShow(() => {
    // setLocalData(data);
    // getUserInfo();
  });

  const chooseMessageClick = async () => {
    const { tempFilePaths } = await Taro.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album"]
    });
    console.log("chooseMessageClick :>> ", tempFilePaths[0]);
    let newData = { ...userInfo };
    newData.avatar = tempFilePaths[0];
    setUserInfo(newData);
  };

  const onDone = () => {
    console.log("onDone :>> ", current);
  };

  const getGender = values => {
    const dates = MAP_SEX.find(({ code }) => code === values?.gender);
    return dates;
  };

  console.log("userInfo :>> ", userInfo);

  return (
    <View className="profile">
      <View className="profile-center-center">
        <YTitleTask
          className="profile-center-item"
          title="Profile Photo"
          onClick={chooseMessageClick}
          right={
            <Image
              className={"profile-center-item-icon"}
              src={userInfo?.avatar || user}
            />
          }
        />
        <YTitleTask
          className="profile-center-item"
          title="Name"
          showIcon={false}
          right={
            <Input
              className="profile-center-item-input"
              placeholder="Name"
              value={userInfo?.nickname || ""}
              onInput={e => {
                current.userData.nickname = e.detail.value;
                const NewUserInfo = { ...userInfo };
                NewUserInfo.nickname = e.detail.value;
                setUserInfo(NewUserInfo);
              }}
            />
          }
        />

        <Picker
          mode="selector"
          range={MAP_SEX}
          rangeKey="value"
          defaultValue={{
            code: getGender(userInfo)?.code,
            name: getGender(userInfo)?.value
          }}
          onChange={data => {
            const { value } = data.detail;
            const sex = MAP_SEX[value];
            current.userData.gender = sex.code;
            const NewUserInfo = { ...userInfo };
            NewUserInfo.gender_name = sex.value;
            current.userData.gender_name = sex.value;
            setUserInfo(NewUserInfo);
          }}
        >
          <YTitleTask
            className="profile-center-item"
            title="Gender"
            showIcon={false}
            right={
              <View className="profile-center-item-input">
                {userInfo?.gender_name}
              </View>
            }
          />
        </Picker>
        <Picker
          mode={"date"}
          start={"1900-01-01"}
          disabled={false}
          value={
            userInfo?.birthday
              ? formatDate(userInfo.birthday, "yyyy-MM-dd")
              : current.nowDate
          }
          onChange={e => {
            const values = e.detail.value;
            const getTime = getDate(values).getTime();
            current.userData.birthday = getTime;
            const NewUserInfo = { ...userInfo };
            NewUserInfo.birthday = getTime;
            setUserInfo(NewUserInfo);
            console.log(getTime, "e 3333333:>> ", values);
          }}
        >
          <View className="profile-center-item-pick">
            <View className={"profile-center-item-pick-title"}>Birthday</View>
            <View className="profile-center-item-pick-input">
              {userInfo?.birthday
                ? formatDate(userInfo.birthday, "yyyy-MM-dd")
                : "Birthday"}
            </View>
          </View>
        </Picker>

        <YTitleTask
          className="profile-center-item"
          title="My QR"
          onClick={() => {
            Taro.navigateTo({
              url: "/pagesUser/code/index"
            });
          }}
          right={<Image className={"profile-center-item-icon"} src={QR_code} />}
        />
        <YTitleTask
          className="profile-center-item"
          title="Email"
          showIcon={false}
          right={
            <Input
              className="profile-center-item-input"
              placeholder="email"
              type="nickname"
              value={userInfo?.email || ""}
              onInput={e => {
                current.userData.email = e.detail.value;
                const NewUserInfo = { ...userInfo };
                NewUserInfo.email = e.detail.value;
                setUserInfo(NewUserInfo);
              }}
            />
          }
        />
        <YTitleTask
          className="profile-center-item"
          title="Phone"
          showIcon={false}
          right={
            <Input
              className="profile-center-item-input"
              placeholder="phone"
              type="number"
              value={userInfo?.phone || ""}
              onInput={e => {
                current.userData.phone = e.detail.value;
                const NewUserInfo = { ...userInfo };
                NewUserInfo.phone = e.detail.value;
                setUserInfo(NewUserInfo);
              }}
            />
          }
        />
      </View>

      <View className={"profile-button"}>
        <YButton yType="default" onClick={onDone}>
          <View className={"profile-button-item"}>Done</View>
        </YButton>
      </View>
    </View>
  );
};

export default Profile;
