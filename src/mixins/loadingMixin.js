import wepy from 'wepy';

export default class LoadingMixin extends wepy.mixin {
  data = {
    a: 1
  }
  loadingIn ( text ) {
    wepy.showLoading( {
      title: text,
      mask: true
    } );
  }
  loadingOut () {
    wepy.hideLoading();
  }
  toastSucc ( text ) {
    wepy.showToast( {
      title: text,
      mask: true
    } );
  }
  toastFail ( text, duration ) {
    wepy.showToast( {
      title: text,
      image: '/image/fail.png',
      mask: true,
      duration: duration || 2000
    } );
  }
}
