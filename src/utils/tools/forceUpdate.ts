/**
 * 强制小程序版本更新提示
 */
export default function() {
  const updateManager = wx.getUpdateManager();
  updateManager.onUpdateReady(function() {
    wx.showModal({
      title: '更新提示',
      content: '检测到新版本，是否更新并重启小程序？',
      success(res) {
        if (res.confirm) {
          updateManager.applyUpdate();
        }
      },
    });
  });
}
