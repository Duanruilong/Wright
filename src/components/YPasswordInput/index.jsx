import { useState } from "react";
import { View, Image } from "@tarojs/components";
import classnames from "classnames";
import YInput from "@/components/YInput";
import passwordHide from "./password_hide.png";
import passwordShow from "./password_show.png";
import "./index.scss";

const PasswordInput = props => {
  const { name, placeholder, className, ...rest } = props;
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();

  const onChange = e => {
    setValue(e.detail.value);
    props.onChange && props.onChange(e.detail.value);
  };

  return (
    <View className={classnames(`y-password-input`)}>
      {show ? (
        <>
          <YInput
            type={"text"}
            className={classnames(className, `y-password-input-text`)}
            // maxlength={6}
            value={value}
            placeholder={placeholder}
            name={`${name}-text`}
            onInput={onChange}
            {...rest}
          />
          <View
            className={"y-password-input-icon"}
            onClick={() => {
              setShow(!show);
            }}
          >
            <Image className={"y-password-input-image"} src={passwordShow} />
          </View>
        </>
      ) : (
        <>
          <YInput
            type={"password"}
            className={classnames(`y-password-input-text`, className)}
            password
            value={value}
            placeholder={placeholder}
            name={`${name}-password`}
            onInput={e => {
              onChange(e);
            }}
            {...rest}
          />
          <View
            className={"y-password-input-icon"}
            onClick={() => {
              setShow(!show);
            }}
          >
            <Image className={"y-password-input-image"} src={passwordHide} />
          </View>
        </>
      )}
    </View>
  );
};

export default PasswordInput;
