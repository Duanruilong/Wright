import Taro from "@tarojs/taro";

/**
 * 判断是否为字符串
 */
export function isString(source) {
  return (
    typeof source === "string" ||
    (!!source &&
      typeof source === "object" &&
      Object.prototype.toString.call(source) === "[object String]")
  );
}
// 货币
export const isCurrency = value => {
  const data = {
    1: "$",
    2: "￥"
  };
  if (value === 1 || value === "zh") {
    return data[1];
  }
  if (value === 2 || value === "cn") {
    return data[2];
  }
  return null;
};
// 货币单位转化
export const conCurrency = (value, multiple) => {
  const data = value / Math.pow(10, multiple);
  // return Number(data.toFixed(2));

  let num = Number(data).toFixed(2);
  return num;
};

export const isNumber = value => {
  return typeof value === "number";
};

export const isObject = value => {
  return Object.prototype.toString.call(value) === "[object Object]";
};

export const isArray = value => {
  return Object.prototype.toString.call(value) === "[object Array]";
};

export const isBoolean = value => {
  return (
    value === true ||
    value === false ||
    (isObject(value) &&
      Object.prototype.toString.call(value) === "[object Boolean]")
  );
};

const pattern = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp(
    "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
    "i"
  ),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};

export const isEmail = value => {
  return (
    typeof value === "string" &&
    !!value.match(pattern.email) &&
    value.length < 255
  );
};

/**
 * 防抖函数
 * @param fn
 * @param wait
 */
export function debounce(fn, wait) {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      clearTimeout(timer);
      fn(...args);
    }, wait);
  };
}

export function rpxToPx(rpx) {
  const info = Taro.getSystemInfoSync();
  const { windowWidth } = info;
  return (rpx / 750) * windowWidth;
}

/**
 * 时间格式化
 * 入参
 * {number} {required} ：时间戳
 * {string} ：格式类型，默认yyyy-MM-dd hh:mm:ss
 */
export function formatDate(_date, _format = "yyyy-MM-dd hh:mm:ss") {
  if (!_date) {
    return "";
  }
  const date = new Date(_date);
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  let format = _format;
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      date
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    );
  }
  Object.keys(o).forEach(k => {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : `00${o[k]}`.substr(o[k].toString().length)
      );
    }
  });
  return format;
}

/**
 * 获取正确的Date，由于iOS上的兼容问题，替换字符串中的-为/
 * @param _date
 */
export function getDate(_date) {
  if (!_date) {
    return null;
  }
  if (isNumber(_date)) {
    return new Date(_date);
  }
  const date = _date.replace(/-/g, "/");
  return new Date(date);
}

/**
 *解析后端转码后的videoInfo
 * 目前只取videos[0]，未来做清晰度转换时再改
 */
export function parseVideoInfo(videoInfo) {
  if (videoInfo) {
    const { firstFrameUrl = null, name = null, videos = [] } = videoInfo;
    if (videos && videos.length > 0) {
      return {
        url: videos[0].url,
        thumbUrl: firstFrameUrl,
        name
      };
    }
  }
  return {
    url: undefined,
    thumbUrl: undefined,
    name: undefined
  };
}

export const getStorageData = async key => {
  let result;
  try {
    const { data } = await Taro.getStorage({ key });
    result = data;
  } catch (error) {
    console.log(error);
  }
  return result;
};

// export function getStorageData(key) {
//   let result;
//   Taro.getStorage({
//     key
//   })
//     .then(res => {
//       console.log(key, "getStorageData :>> ", res);
//       if (res.data) {
//         result = res.data;
//         return result;
//       }
//     })
//     .catch(() => {
//       return result;
//     });
//   console.log(key, "getStorageData :result>> ", result);
// }

export function isEmpty(value) {
  // null 或者 未定义，则为空
  if (value === null || value === undefined) {
    return true;
  }
  // 传入空字符串，则为空
  if (typeof value === "string") {
    return value === "";
  }
  // 传入数组长度为0，则为空
  if (value instanceof Array) {
    return !value.length;
  }
  // 传入空对象，则为空
  if (value instanceof Object) {
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * 设置url参数
 * @param url url地址
 * @param params 参数
 */
export function setUrlParams(_url = "", params = {}) {
  const arr = [];
  let url = null;
  Object.keys(params).forEach(key => {
    const value = isEmpty(params[key]) ? "" : params[key];
    arr.push(`${key}=${value}`);
  });
  if (_url.indexOf("?") !== -1) {
    url = `${_url}&${arr.join("&")}`;
  } else {
    url = `${_url}?${arr.join("&")}`;
  }
  return url;
}
