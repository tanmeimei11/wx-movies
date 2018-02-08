import wepy from 'wepy';
import Index from '@/api/index';
import report from '@/components/report-submit';
import researchWindow from '@/components/researchWindow';
import track from '@/utils/track';

export default class index extends wepy.page {
  config = {
    navigationBarTitleText: 'in同城趴·电影'
  }
  components = { report, researchWindow }

  mixins = []

  data = {
    showResearchWindow: false,
    researchInfo: {},
    btnon: true,
    texts: {},
    bgImage: '',
    qrcode: ''
  }

  computed = {}

  methods = {
    closeResearchWindow () {
      this.showResearchWindow = false;
    },
    toDetail () {
      if ( !this.btnon ) {
        return;
      }

      track( 'immediately_buy' );
      wepy.navigateTo( {
        url: '/pages/detail/detail'
      } );
    }
  }

  onShareAppMessage ( res ) {
    return {
      title: this.shareInfo.share_txt,
      path: `/pages/index/index?qrcode_from=${this.qrcode}`
      // imageUrl: this.shareInfo.share_img
      // 'http://inimg07.jiuyan.info/in/2018/01/26/20A52317-E4EB-3657-E024-F2EF040B2E86.jpg'
    };
  }

  events = {
  }

  async onLoad ( option ) {
    if ( option.qrcode_from ) {
      this.$parent.globalData.qrcode_from = option.qrcode_from;
    }
    if ( option.directTo === 'detail' ) {
      wepy.navigateTo( {
        url: `/pages/detail/detail`
      } );
    }
    if ( option.showWin === 'research' ) {
      this.showResearchWindow = true;
      this.researchInfo = await Index.getResearchInfo();
    }
    var InfoRes = await Index.getIndexInfo();
    this.texts = InfoRes;
    this.qrcode = InfoRes.qrcode_from || '';
    this.btnon = InfoRes.cf_start !== 'false';
    this.bgImage = InfoRes.bg_img;
    this.$apply();
  }
}
