import Taro from "@tarojs/taro";
import { objectEqual } from "./tools";

const cacheData = {};

// export interface CacheOptions {
//   key: string;
//   params: object;
//   data?;
// }

function setCache(options) {
  const { key, params, data } = options;
  cacheData[key] = { params, data };
}

function getCache(options) {
  const { key, params } = options;
  const item = cacheData[key];
  if (item) {
    if (objectEqual(item.params, params)) {
      return item.data;
    }
  }
  return null;
}

function setLocal(options) {
  const { key, params, data } = options;
  Taro.setStorage({
    key,
    data: options
  });
}

function getLocal(options) {
  const { key, params } = options;
  const item = () => {
    Taro.getStorage({
      key: key,
      success: function(res) {
        return res.data;
      }
    });
  };
  if (item) {
    if (objectEqual(item.params, params)) {
      return item.data;
    }
    Taro.removeStorageSync(key);
  }
  return null;
}

// interface ItemType extends CacheOptions {
//   type: string;
// }

export function setCacheItem({ type, ...args }) {
  if (type === "local") {
    return setLocal(args);
  }
  return setCache(args);
}

export function getCacheItem({ type, ...args }) {
  if (type === "local") {
    return getLocal(args);
  }
  return getCache(args);
}

// type RemoveItemType = { type; key };

export function removeCacheItem({ type, key }) {
  if (type === "local") {
    window.localStorage.removeItem(key);
    return;
  }
  delete cacheData[key];
}
