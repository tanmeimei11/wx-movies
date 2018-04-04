import wepy from 'wepy';

export default class cutdownTimer extends wepy.mixin {
  data = {
    countDownSecond: 0
  }
  // 倒计时
  countdown ( duration, timer ) {
    this.clearTime( this.globalTimerName );
    if ( duration <= 0 ) return;
    this.countDownSecond = duration;
    this.countDownSecond--;
    var cutDownFun = () => {
      this.countDownSecond--;
      if ( this.countDownSecond <= 0 ) { // 倒计时结束
        console.log( '0000' );
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
