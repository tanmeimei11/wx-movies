import wepy from 'wepy';
import auth from '@/api/auth';
import Upgrade from '@/api/upgrade';
// import tips from '@/utils/tips';
import report from '@/components/report-submit';
// import shareConnectMixin from '@/mixins/shareConnectMixin';
// import receiveFaildModal from '@/components/detail/receiveFaildModal';
// import adBanner from '@/components/adBanner';
import seckill from '@/components/upgrade/seckill';
import goSeat from '@/components/upgrade/goSeat';
import upgradePay from '@/components/detail/upgradePay';
import track from '@/utils/track';
import {getParamV} from '@/utils/common';

export default class upgrade extends wepy.page {
  config = {
    navigationBarTitleText: ''
  }
  components = {report, upgradePay, seckill, goSeat}
  mixins = []
  data = {
    upgrade: {},
    cinema_photos: [],
    videoInfo: {},
    videoShow: false,
    upgradeInfo: {},
    ticketid: 1,
    isShowSeckill: false,
    isShowGoSeat: false,
    countDown: 0
  }

  events = {
    seckillEnd () {
      this.initSeckillEnd();
      this.$apply();
    },
    goSeat () {
      this.$invoke( 'upgradePay', 'jumpToSeat' );
    },
    goUpgrade () {
      this.$invoke( 'upgradePay', 'paypiao' );
    },
    openSeatModal () {
      this.isShowGoSeat = true;
    },
    closeGoSeatModal () {
      this.isShowGoSeat = false;
    },
    countDownJian ( seconds ) {
      this.countDown = seconds;
    }
  }

  methods = {
    showVideo () {
      this.videoShow = true;
    },
    videoEnd () {
      this.videoShow = false;
    }
  }

  async init ( options ) {
    this.ticketid = options.ticketid;
    var myInfoRes = await Upgrade.getUpgradeData( options.ticketid );
    this.upgrade = myInfoRes;
    this.cinema_photos = myInfoRes.cinema_photos;
    this.videoInfo = myInfoRes.video_info;
    this.upgradeInfo = myInfoRes.upgrade_info;
    if ( myInfoRes.upgrade_info.is_first && parseInt( myInfoRes.upgrade_info.count_down ) > 0 ) {
      this.$invoke( 'seckill', 'init', parseInt( myInfoRes.upgrade_info.count_down ) );
      this.isShowSeckill = true;
    } else {
      this.initSeckillEnd();
    }
    this.$apply();
  }
  async onLoad ( options ) {
    console.log( options );
    this.initQrcodeFrom( options );
    await auth.ready();
    track( 'fission_ticket_upgrade_page_enter' );
    await this.init( options );
  }
  initSeckillEnd () {
    if ( this.upgradeInfo.is_first ) {
      this.isShowSeckill = false;
      this.upgrade.bg_img01 = this.upgradeInfo.bg_img;
      this.upgradeInfo.all_day_price = this.upgradeInfo.origin_price;
      this.upgradeInfo.btn_text = this.upgradeInfo.origin_price_btn_text;
    }
  }

  initQrcodeFrom ( options ) {
    console.log( options );
    var qf = options.qrcode_from || getParamV( options, 'qf' );
    this.$parent.globalData.qrcode_from = qf;
    this.qrcode_from = qf;
    console.log( this.qrcode_from );
  }
}
