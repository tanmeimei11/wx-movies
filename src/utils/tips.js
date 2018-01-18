/**
 * 提示与加载工具类
 */
export default class Tips {
  static isLoading = false

  /**
   * 弹出提示框
   */
  static success(title, duration = 1500) {
    my.showToast({
      title: title,
      icon: 'success',
      mask: true,
      duration: duration
    })
    if (duration > 0) {
      return new Promise(resolve => setTimeout(resolve, duration))
    }
  }

  /**
   * 弹出确认窗口
   */
  static confirm (text, payload = {}, title = '提示') {
    return new Promise((resolve, reject) => {
      my.confirm({
        title: title,
        content: text,
        success: res => {
          if (res.confirm) {
            resolve(payload)
          } else {
            reject(payload)
          }
        },
        fail: res => {
          reject(payload)
        }
      })
    })
  }

  static toast (title, onHide, icon = 'success') {
    my.showToast({
      content: title,
      type: icon,
      duration: 1500
    })
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 1500)
    }
  }

  /**
   * 错误框
   */
  static error (title, onHide) {
    my.showToast({
      content: title,
      type: 'fail',
      duration: 1500
    })
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide()
      }, 500)
    }
  }

  /**
   * 弹出加载提示
   */
  static loading (title = '加载中', force = false) {
    if (this.isLoading && !force) { return }
    this.isLoading = true
    my.showLoading({ content: title })
  }

  /**
   * 加载完毕
   */
  static loaded () {
    if (this.isLoading) {
      this.isLoading = false
      my.hideLoading()
    }
  }

  static setLoading () {
    this.isLoading = true
  }
}
