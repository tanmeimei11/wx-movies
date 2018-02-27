import wepy from 'wepy';
import auth from '@/api/auth';
// import { request } from '@/utils/request';
// import tips from '@/utils/tips';
import videoComp from '@/components/videoComp';
import report from '@/components/report-submit';
import track from '@/utils/track';
// import Card from '@/api/card';

export default class updateCard extends wepy.page {
  config = {
    navigationBarTitleText: '升级电影卡'
  }
  components = {report, videoComp}

  data = {
    videoInfo: {}
  }

  onShareAppMessage ( res ) {
    return {
      title: '送你一张in同城趴电影王卡，杭州三个月电影无限看！',
      path: `/pages/detail/detail`,
      imageUrl: 'https://inimg01.jiuyan.info/in/2018/01/25/FB5D55FB-986F-6433-18B8-BAF8C0C797E3.jpg'
    };
  }

  events={

  }

  methods = {

  }

  /**
   * 初始化页面信息
   */
  async init () {
  }
  /**
   * 初始化视频信息
   */
  initVideoInfo ( ) {
    this.videoInfo = {
      support: wepy.canIUse( 'video' ),
      coverImgUrl: 'http://inimg07.jiuyan.info/in/2018/02/23/5B68F03B-601D-9C32-5B72-39B6BA01F90F.png',
      videoUrl: 'http://inimg07.jiuyan.info/in/2018/02/23/5B68F03B-601D-9C32-5B72-39B6BA01F90F.png'
    };
  }

  async onLoad ( options ) {
    track( 'updatecard_page_screen' );
  }
}
