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
    texts: {}
  }

  computed = {}

  methods = {
    closeResearchWindow () {
      this.showResearchWindow = false
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
    if ( option.showWin === 'research') {
      this.showResearchWindow = true
      this.researchInfo = await Index.getResearchInfo();
    }
    var InfoRes = await Index.getIndexInfo();
    this.texts = InfoRes;
    this.btnon = InfoRes.cf_start !== 'false';
    this.$apply();
  }
}
