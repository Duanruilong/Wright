/* eslint-disable no-undef */
export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/chat/index",
    "pages/search/index",
    "pages/cart/index",
    "pages/user/index",
    "pages/login/index",
    "pages/loginSec/index",
    "pages/editor/index"
  ],
  subPackages: [
    {
      root: "pagesGoods/",
      pages: [
        "bannerDetail/index",
        "detail/index",
        "order/index",
        "orderReturn/index",
        "orderReview/index",
        "searchRes/index",
        "pay/index"
      ]
    },
    {
      root: "pagesUser/",
      pages: [
        "updatePassword/index",
        "profile/index",
        "code/index",
        "contact/index",
        "chatting/index",
        "chatAdd/index",
        "chatExam/index",
        "points/index",
        "cash/index",
        "notifications/index",
        "gift/index",
        "groupPurchase/index",
        "goodsList/index",
        "goodsViewed/index",
        "address/index",
        "addressEdit/index",
        "payment/index",
        "paymentEdit/index",
        "setting/index",
        "settingSec/index",
        "help/index",
        "helpSec/index",
        "policy/index",
        "coupons/index"
      ]
    }
  ],
  preloadRule: {
    "pages/login/index": {
      network: "all",
      packages: ["pagesUser"]
    },
    "pages/index/index": {
      network: "all",
      packages: ["pagesUser"]
    },
    "pages/user/index": {
      network: "all",
      packages: ["pagesUser"]
    }
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    color: "#8c8c8c",
    // backgroundColor: "#edecee",
    selectedColor: "#000000",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/index/index",
        text: "Wright",
        iconPath: "assets/worktop.png",
        selectedIconPath: "assets/worktop_select.png"
      },
      {
        pagePath: "pages/chat/index",
        text: "Chat",
        iconPath: "assets/chat.png",
        selectedIconPath: "assets/chat_select.png"
      },
      {
        pagePath: "pages/search/index",
        text: "Search",
        iconPath: "assets/search_bar.png",
        selectedIconPath: "assets/search_bar.png"
      },
      {
        pagePath: "pages/cart/index",
        text: "Cart",
        iconPath: "assets/cart.png",
        selectedIconPath: "assets/cart_select.png"
      },
      {
        pagePath: "pages/user/index",
        text: "Account",
        iconPath: "assets/user.png",
        selectedIconPath: "assets/user_select.png"
      }
    ]
  }
});
