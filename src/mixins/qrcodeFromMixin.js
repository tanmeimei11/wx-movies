import wepy from 'wepy';
import {getParamV} from '@/utils/common';

export default class qrcodeFromMixin extends wepy.mixin {
  initQrcodeFrom ( options ) {
    console.log( options );
    var qf = options.qrcode_from || getParamV( options, 'qf' );
    this.$parent.globalData.qrcode_from = qf;
    this.qrcodeFrom = qf;
    console.log( this.qrcodeFrom );
  }
}
