import wepy from 'wepy';

export default class cutdownTimer extends wepy.mixin {
  // 倒计时
  countdown ( duration, timer ) {
    this.clearTime( this.globalTimerName );
    if ( duration > 0 ) { // 进入倒计时
      this.countDown = duration;
    }
    this.countDown--;
    var cutDownFun = () => {
      this.countDown--;
      if ( this.countDown <= 0 ) { // 倒计时结束
        this.$emit( 'countdownFinish' );
        this.clearTime( timer );
      }
      this.$apply();
    };

    wepy.$instance.globalData[timer] = setInterval( cutDownFun, 1000 );
  }

  // 清除倒计时
  clearTime ( timer ) {
    var _cutTimer = wepy.$instance.globalData[timer];
    if ( _cutTimer ) {
      clearInterval( _cutTimer );
    }
  }
}
