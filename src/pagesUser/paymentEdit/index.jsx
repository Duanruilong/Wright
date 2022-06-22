import { useState, useEffect, useRef } from "react";
import Taro, { Current } from "@tarojs/taro";
import {
  View,
  Input,
  Image,
  ScrollView,
  Picker,
  Text
} from "@tarojs/components";
import YButton from "@/components/YButton";
import YTitleTask from "@/components/YTitleTask";
import selectNo from "@/assets/select_no.png";
import selectItem from "@/assets/select_yes.png";
import { getStorageData, isEmpty, getDate, formatDate } from "@/utils/utils";
import { toast } from "@/utils/tools";
import { getNewAddresses, getEditAddress } from "./service";
import "./index.scss";

/**
 *  @Author: duanruilong
 *  @Date: 2022-04-25 10:57:04
 *  @Desc: PaymentEdit 新增及编辑
 *  */

const PaymentEdit = () => {
  const { windowHeight } = Taro.getSystemInfoSync();
  const [params] = useState(Current.router.params);
  const { current } = useRef({ userInfo: {} });
  const [def, setDef] = useState(false);
  const [addressData, setAddressData] = useState({});
  const langPicker = ["English", "ch1", "zh1"];
  const [seLang, setSeLang] = useState();

  useEffect(() => {
    getStorageData("userInfo").then(values => {
      current.userInfo = values;
    });
    if (params?.type === "edit") {
      Taro.setNavigationBarTitle({
        title: "Edit Payment Card"
      });
      // 修改地址
      getStorageData("order_address_item").then(values => {
        console.log("order_address_item :>> ", values);
        setDef(values?.isdefault === 1 ? true : false);
        setAddressData(values);
      });
    }
  }, []);

  // 点击
  const onSubmit = () => {
    console.log(current, "onItemClick :>> ", addressData);
    if (
      isEmpty(addressData.card_num) ||
      isEmpty(addressData.exp_date) ||
      isEmpty(addressData.sec_code) ||
      isEmpty(addressData.name_card) ||
      isEmpty(addressData.address) ||
      isEmpty(addressData.city) ||
      isEmpty(addressData.state) ||
      isEmpty(addressData.post_code)
    ) {
      return toast("Please fill in the complete information");
    }

    // if (params.type === "edit") {
    //   // 修改Pay
    //   getEditAddress({
    //     ...addressData,
    //     country: current.userInfo.country,
    //     userid: current.userInfo.userid,
    //     isdefault: def ? 1 : 0
    //   }).then(res => {
    //     console.log("res :>> ", res);
    //     toast("Success");
    //     setTimeout(() => {
    //       Taro.navigateBack();
    //     }, 800);
    //   });
    // } else {
    //   //新增Pay
    //   getNewAddresses({
    //     ...addressData,
    //     country: current.userInfo.country,
    //     userid: current.userInfo.userid,
    //     isdefault: def ? 1 : 0
    //   }).then(res => {
    //     console.log("res :>> ", res);
    //     toast("Success");
    //     setTimeout(() => {
    //       Taro.navigateBack();
    //     }, 800);
    //   });
    // }
  };

  return (
    <View className="payment-edit">
      <ScrollView
        style={{
          height: windowHeight - 400
        }}
        className="payment-edit-score"
        scrollY
        scrollWithAnimation
      >
        <YTitleTask
          className="payment-edit-score-item"
          title="Card Number"
          showIcon={false}
          right={
            <Input
              className="payment-edit-score-item-input"
              placeholder="Please enter Card Number"
              type="number"
              value={addressData?.card_num || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.card_num = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="payment-edit-score-item"
          title="Security Codes"
          showIcon={false}
          right={
            <Input
              className="payment-edit-score-item-input"
              placeholder="Please enter Security Codes"
              type="number"
              value={addressData?.sec_code || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.sec_code = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <Picker
          mode={"date"}
          start={"1900-01-01"}
          disabled={false}
          value={
            addressData?.exp_date
              ? formatDate(addressData.exp_date, "yyyy-MM-dd")
              : current.nowDate
          }
          onChange={e => {
            const values = e.detail.value;
            const getTime = getDate(values).getTime();
            const newArr = { ...addressData };
            newArr.exp_date = values;
            newArr.exp_date_time = getTime;
            setAddressData(newArr);
          }}
        >
          <YTitleTask
            className="payment-edit-score-item"
            title="Expiry Date"
            right={
              <View className="payment-edit-score-item-rt">
                <Text className="payment-edit-score-item-rt-tex">
                  {addressData?.exp_date || "Please enter Expiry Date"}
                </Text>
              </View>
            }
          />
        </Picker>

        <YTitleTask
          className="payment-edit-score-item"
          title="Name On Card"
          showIcon={false}
          right={
            <Input
              className="payment-edit-score-item-input"
              placeholder="Please enter Name On Card"
              value={addressData?.name_card || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.name_card = values;
                setAddressData(newArr);
              }}
            />
          }
        />
        <YTitleTask
          className="payment-edit-score-item"
          title="Address"
          showIcon={false}
          right={
            <Input
              className="payment-edit-score-item-input"
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
          className="payment-edit-score-item"
          title="City"
          showIcon={false}
          right={
            <Input
              className="payment-edit-score-item-input"
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

        <Picker
          mode="selector"
          range={langPicker}
          onChange={e => {
            const values = langPicker[e.detail.value];
            const newArr = { ...addressData };
            newArr.state = values;
            setAddressData(newArr);
          }}
        >
          <YTitleTask
            className="payment-edit-score-item"
            title="State"
            right={
              <View className="payment-edit-score-item-rt">
                <Text className="payment-edit-score-item-rt-tex">
                  {addressData?.state || "Please enter State"}
                </Text>
              </View>
            }
          />
        </Picker>

        <YTitleTask
          className="payment-edit-score-item"
          title="Postal Code"
          showIcon={false}
          right={
            <Input
              className="payment-edit-score-item-input"
              placeholder="Please enter Postal Code"
              type="number"
              maxlength={11}
              value={addressData?.post_code || ""}
              onInput={e => {
                const values = e.detail.value;
                const newArr = { ...addressData };
                newArr.post_code = values;
                setAddressData(newArr);
              }}
            />
          }
        />

        <YTitleTask
          className="payment-edit-score-def"
          onClick={() => {
            setDef(!def);
          }}
          title={
            <View className="payment-edit-score-def-cen">
              <Image
                className="payment-edit-score-def-cen-img"
                src={def ? selectItem : selectNo}
              />
              <View className="payment-edit-score-def-cen-title">
                Default Card
              </View>
            </View>
          }
          showIcon={false}
        />
      </ScrollView>
      {/* button */}
      <View className="payment-edit-but">
        <YButton
          yType="default"
          onClick={() => {
            onSubmit();
          }}
        >
          <View className="payment-edit-but-cent">Done</View>
        </YButton>
      </View>
    </View>
  );
};

export default PaymentEdit;
