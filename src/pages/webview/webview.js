import wepy from 'wepy';

export default class Webview extends wepy.page {
  config = {
    navigationBarTitleText: ''
  }
  data = {
    webviewShow: false,
    webviewUlr: ''
  }
  events = {
  }

  methods = {
  }

  onLoad ( options ) {
    this.webviewUlr = decodeURIComponent( options.h5url );
    this.webviewShow = true;
  }
}
