// import { getStorageData } from "@/utils/utils";

// const useName = getStorageData("use-name");

export const EMOJIS = [
  { id: 1, src: `😀` },
  { id: 2, src: `😃` },
  { id: 3, src: `😄` },
  { id: 4, src: `😆` },
  { id: 5, src: `😅` },
  { id: 6, src: `🤣` },
  { id: 7, src: `😂` },
  { id: 8, src: `🙂` },
  { id: 9, src: `😊` },
  { id: 10, src: `😇` },
  { id: 11, src: `😟` },
  { id: 12, src: `😲` },
  { id: 13, src: `😳` },
  { id: 14, src: `🥺` },
  { id: 15, src: `😧` },
  { id: 16, src: `😨` },
  { id: 17, src: `😰` },
  { id: 18, src: `😥` },
  { id: 19, src: `😥` },
  { id: 20, src: `😭` },
  { id: 21, src: `😱` },
  { id: 22, src: `😖` },
  { id: 23, src: `😣` },
  { id: 24, src: `😓` },
  { id: 25, src: `😩` },
  { id: 26, src: `🥱` },
  { id: 27, src: `😤` },
  { id: 28, src: `😡` },
  { id: 29, src: `😠` },
  { id: 30, src: `🥰` },
  { id: 31, src: `😍` },
  { id: 32, src: `🤩` },
  { id: 33, src: `😘` },
  { id: 34, src: `😋` },
  { id: 35, src: `😛` },
  { id: 36, src: `😜` },
  { id: 37, src: `😝` },
  { id: 38, src: `🤑` },
  { id: 39, src: `🤗` },
  { id: 40, src: `🤭` },
  { id: 41, src: `🤫` },
  { id: 42, src: `🤔` },
  { id: 43, src: `😏` },
  { id: 44, src: `😒` },
  { id: 45, src: `🙄` },
  { id: 46, src: `😬` },
  { id: 47, src: `😌` },
  { id: 48, src: `😔` },
  { id: 49, src: `😪` },
  { id: 50, src: `😴` },
  { id: 51, src: `😷` },
  { id: 52, src: `🤕` },
  { id: 53, src: `🤮` },
  { id: 54, src: `🤧` },
  { id: 55, src: `🥵` },
  { id: 56, src: `🥶` },
  { id: 57, src: `😵` },
  { id: 58, src: `🤯` },
  { id: 59, src: `🤠` },
  { id: 60, src: `🥳` },
  { id: 61, src: `😎` },
  { id: 62, src: `🤓` },
  { id: 63, src: `🧐` },
  { id: 64, src: `😈` },
  { id: 65, src: `💀` },
  { id: 66, src: `👻` },
  { id: 67, src: `😺` },
  { id: 68, src: `😸` },
  { id: 69, src: `😹` },
  { id: 70, src: `😻` },
  { id: 71, src: `😼` },
  { id: 72, src: `😽` },
  { id: 73, src: `😿` },
  { id: 74, src: `🙀` },
  { id: 75, src: `😾` },
  { id: 76, src: `💖` },
  { id: 77, src: `💝` },
  { id: 78, src: `❤` },
  { id: 79, src: `💚` },
  { id: 80, src: `💙` },
  { id: 81, src: `💜` },
  { id: 82, src: `🤎` },
  { id: 83, src: `🖤` },
  { id: 84, src: `🤍` },
  { id: 85, src: `💦` },
  { id: 86, src: `💨` },
  { id: 87, src: `💣` },
  { id: 88, src: `💤` },
  { id: 89, src: `👋` },
  // { id: 90, src: `🧑‍🎓` },
  // { id: 91, src: `🧑‍🏫` },
  // { id: 92, src: `🧑‍💻` },
  { id: 93, src: `👮` },
  { id: 94, src: `💂` },
  { id: 95, src: `🤵‍♂️` },
  { id: 96, src: `🤵‍♀️` },
  { id: 97, src: `🏃` },
  { id: 98, src: `🏃‍♀️` },
  { id: 99, src: `👣` },
  { id: 100, src: `👌` },
  { id: 101, src: `✌` },
  { id: 102, src: `👈` },
  { id: 103, src: `👉` },
  { id: 104, src: `👆` },
  { id: 105, src: `🖕` },
  { id: 106, src: `👇` },
  { id: 107, src: `👍` },
  { id: 108, src: `👎` },
  { id: 109, src: `✊` },
  { id: 110, src: `👊` },
  { id: 111, src: `👏` },
  { id: 112, src: `🙌` },
  { id: 113, src: `🤝` },
  { id: 114, src: `🙏` },
  { id: 115, src: `✍` },
  { id: 116, src: `💪` },
  { id: 117, src: `👃` },
  { id: 118, src: `👂` },
  { id: 119, src: `👀` },
  { id: 120, src: `👅` },
  { id: 121, src: `👄` }
];

export const ENV = process.env.DEPLOY_ENV;

// export const NAME = useName?.data;

export const VERSION = process.env.VERSION;

export const LOGIN_CHANNEL = "login-channel"; // 登录频道

// export const USERS_KEY = `${NAME}-userid`;

export const LOGIN_PAGE = "/pages/login/index";

export const HOME_PAGE = "/pages/index/index";

export const SYSTEM = "REPRESENT";

// 性别
export const MAP_SEX = [
  {
    code: 1,
    value: "男"
  },
  {
    code: 2,
    value: "女"
  }
];

// 货币类型,1人民币 2美元
export const MAP_UNIT = {
  1: "￥",
  2: "$"
};

/**
 * 搜索本地缓存
 */
export const SEARCH_LOCAL = "search-local";

export const COUNTRY = "cn";

export const ALPHABETIC = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];
