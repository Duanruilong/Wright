/* eslint-disable no-undef */
module.exports = {
  env: {
    NODE_ENV: '"development"',
    DEPLOY_ENV: '"dev"',
    // APP_ID: 'wright_1', // 应用 ID
    // APP_NAME: 'wright', // # 应用名称
    // VERSION_NAME: 1.0, // # 应用版本号
    // VERSION_CODE: 10, //# 用于应用市场、程序内部识别版本，判断新旧版本，一般递增处理
    // KEYSTORE_FILE: debug.keystore, // # 签名文件
    // KEYSTORE_PASSWORD: 123456, // # 密码
    // KEYSTORE_KEY_ALIAS: 'key0', // # 别名
    // KEYSTORE_KEY_PASSWORD: 123456 // # 别名的密码
  },
  rn: {
    appName: "taroDemo",
    output: {
      ios: "./ios/main.jsbundle",
      iosAssetsDest: "./ios",
      android: "./android/app/src/main/assets/index.android.bundle",
      androidAssetsDest: "./android/app/src/main/res",
      iosSourcemapOutput: "./ios/main.map",
      androidSourcemapOutput: "./android/app/src/main/assets/index.android.map"
    }
  },
  defineConstants: {},
  mini: {},
  h5: {}
};
