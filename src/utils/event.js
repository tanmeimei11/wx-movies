const WxNotificationCenter = require('./WxNotificationCenter.js');

export default class Event {
  static $on(eventName, callback, observer) {
    WxNotificationCenter.addNotification(eventName, callback, observer)
  }

  static $emit(eventName, params) {
    WxNotificationCenter.postNotificationName(eventName, params)
  }

  static $off(eventName, observer) {
    WxNotificationCenter.removeNotification(eventName, observer)
  }
}
