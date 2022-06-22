import { useState, useEffect, useRef } from "react";
import Taro, { useDidShow, Current } from "@tarojs/taro";
import { View, Input, Image, ScrollView } from "@tarojs/components";
import YButton from "@/components/YButton";
import YTitleTask from "@/components/YTitleTask";
import selectNo from "@/assets/select_no.png";
import selectItem from "@/assets/select_yes.png";
import { getStorageData, isEmpty } from "@/utils/utils";
import { toast } from "@/utils/tools";
import { getNewAddresses, getEditAddress } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-13 10:57:04
 *  @Desc: addressEdit 新增及编辑
 *  */

const AddressEdit = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userInfo: {} });
  const [def, setDef] = useState(false);
  const [addressData, setAddressData] = useState({});

  useEffect(() => {
    getStorageData("userInfo").then(values => {
      current.userInfo = values;
    });
    if (params?.type === "edit") {
      Taro.setNavigationBarTitle({
        title: "Edit Address"
      });
      // 修改地址
      getStorageData("order_address_item").then(values => {
        setDef(values?.isdefault === 1 ? true : false);
        setAddressData(values);
      });
    }
  }, []);

  // 点击
  const onSubmit = () => {
    console.log(current, "onItemClick :>> ", addressData);
    if (
      isEmpty(addressData.title) ||
      isEmpty(addressData.firstname) ||
      isEmpty(addressData.lastname) ||
      isEmpty(addressData.phone) ||
      isEmpty(addressData.destination) ||
      isEmpty(addressData.address) ||
      isEmpty(addressData.city) ||
      isEmpty(addressData.state) ||
      isEmpty(addressData.postcodes)
    ) {
      return toast("Please fill in the complete information");
    }

    if (params.type === "edit") {
      // 修改地址
      getEditAddress({
        ...addressData,
        country: current.userInfo.country,
        userid: current.userInfo.userid,
        isdefault: def ? 1 : 0
      }).then(res => {
        console.log("res :>> ", res);
        toast("Success");
        setTimeout(() => {
          Taro.navigateBack();
        }, 800);
      });
    } else {
      //新增
      getNewAddresses({
        ...addressData,
        country: current.userInfo.country,
        userid: current.userInfo.userid,
        isdefault: def ? 1 : 0
      }).then(res => {
        console.log("res :>> ", res);
        toast("Success");
        setTimeout(() => {
          Taro.navigateBack();
        }, 800);
      });
    }
  };

  return (
    <View className="address-edit">
      <ScrollView
        style={{
          height: windowHeight - 400
        }}
        className="address-edit-score"
        scrollY
        scrollWithAnimation
      >
        <YTitleTask
          className="address-edit-score-item"
          title="Address Title"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter Address Title"
              value={addressData?.title || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.title = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="First Name"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter First Name"
              value={addressData?.firstname || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.firstname = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="Last Name"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter Last Name"
              value={addressData?.lastname || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.lastname = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="Phone"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter Phone"
              type="number"
              maxlength={11}
              value={addressData?.phone || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.phone = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="Destination"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter Destination"
              value={addressData?.destination || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.destination = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="Address"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter Address"
              value={addressData?.address || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.address = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="City"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter City"
              value={addressData?.city || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.city = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="State"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter State"
              value={addressData?.state || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.state = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-item"
          title="Post Codes"
          showIcon={false}
          right={
            <Input
              className="address-edit-score-item-input"
              placeholder="Please enter Post Codes"
              type="number"
              value={addressData?.postcodes || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.postcodes = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="address-edit-score-def"
          onClick={() => {
            setDef(!def);
          }}
          title={
            <View className="address-edit-score-def-cen">
              <Image
                className="address-edit-score-def-cen-img"
                src={def ? selectItem : selectNo}
              />
              <View className="address-edit-score-def-cen-title">
                Default Address
              </View>
            </View>
          }
          showIcon={false}
        />
      </ScrollView>
      {/* button */}
      <View className="address-edit-but">
        <YButton
          yType="default"
          onClick={() => {
            onSubmit();
          }}
        >
          <View className="address-edit-but-cent">Done</View>
        </YButton>
      </View>
    </View>
  );
};

export default AddressEdit;
