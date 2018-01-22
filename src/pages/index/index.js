import wepy from 'wepy';
import Index from '@/api/index';
import report from '@/components/report-submit';

export default class index extends wepy.page {
  config = {
    navigationBarTitleText: 'in同城趴·电影'
  }
  components = { report }

  mixins = []

  data = {
    btnon: true,
    texts: {}
  }

  computed = {}

  methods = {
    toDetail () {
      if ( !this.btnon ) {
        return;
      }
      wepy.navigateTo( {
        url: '/pages/detail/detail'
      } );
    }
  }

  events = {
  }

  async onLoad () {
    var InfoRes = await Index.getIndexInfo();
    this.texts = InfoRes;
    this.btnon = InfoRes.cf_start !== 'false';
    this.$apply();
  }
}
