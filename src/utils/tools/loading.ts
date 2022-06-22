import Taro from '@tarojs/taro';

let isToast = false;

let count = 0;

export function showLoading(option) {
  count++;
  if (isToast) {
    return;
  }
  if (count <= 1) {
    Taro.showToast({ title: '', icon: 'loading', duration: 10000, ...option });
  }
}
export function hideLoading() {
  if (count > 0) {
    count--;
  }
  if (isToast) {
    return;
  }
  if (count === 0) {
    Taro.hideToast();
  }
}
export function showToast(option) {
  Taro.showToast(option);
  isToast = true;
  count = 0;
}
export function toast(title = '', options, callback) {
  showToast({
    title,
    icon: 'none',
    mask: false,
    duration: 2000,
    ...options,
  });

  const timer = setTimeout(() => {
    clearTimeout(timer);
    isToast = false;
    if (callback) {
      callback();
    }
  }, options?.duration || 2000);
  return false;
}
