import wepy from 'wepy';

export default class cutdownTimer extends wepy.mixin {
  data = {
    countDownSecond: 0
  }
  // 倒计时
  countdown ( duration, timer ) {
    this.clearTime( timer );
    if ( duration <= 0 ) return;

    this.countDownSecond = duration;
    this.countDownSecond--;
    var cutDownFun = () => {
      console.log( this.countDownSecond, wepy.$instance.globalData[timer] );
      this.countDownSecond--;
      if ( this.countDownSecond <= 1 ) { // 倒计时结束
        console.log( 'countDownSecond', this.countDownSecond );
        this.$emit( 'countdownFinish' );
        this.clearTime( timer );
        console.log( 'clearTime start' );
      }
      this.$apply();
    };

    wepy.$instance.globalData[timer] = setInterval( cutDownFun, 1000 );
  }

  // 清除倒计时
  clearTime ( timer ) {
    var _cutTimer = wepy.$instance.globalData[timer];
    console.log( _cutTimer );
    if ( _cutTimer ) {
      console.log( 'clearTime start  222' );
      clearInterval( _cutTimer );
    }
  }
}
