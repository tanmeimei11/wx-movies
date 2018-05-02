module.exports = {
  'timestamp': '1518081023',
  'succ': true,
  'data': {
    modules: [
      {
        type: 'img',
        img: 'http://xxxx/xxx.jpg',
        height: 100,
        tip_icon: 'http://xxxxx/xxx.jpg',
        tip_img: 'http://xxxx/xxx.jpg'
      },
      {
        type: 'imgs',
        imgs: ['http://xxxx/xxx.jpg', 'http://xxxx/xxx.jpg'],
        height: 100
      },
      {
        type: 'banner',
        banners: [
          {
            'img_url': 'https://inimg02.jiuyan.info/in/2018/03/14/DBB3DC4C-005C-9AEA-A104-4636895EEC55.png',
            'type': 'miniprogram', // miniprogram path h5
            'app_id': 'wxf34fe3fb525ea139',
            'landing_path': '/pages/index/index?_s=tongchengpadianyingbanner'
          }
        ],
        height: 100
      },
      {
        type: 'video',
        video: {
          'title': '明星邀约',
          'desc': '红海行动张译邀你来in同城趴',
          'cover_img_url': 'http://inimg02.jiuyan.info/in/2018/03/08/E84D3120-30B2-B27A-6E61-ADC7FAC2DEED.png',
          'video_url': 'http://video01.jiuyan.info/in/2018/02/23/FD7BC51A-452F-9F54-2CF6-3A2763D23A25-1WnZPypP.mp4'
        },
        height: 100
      },
      {
        type: 'imgs',
        imgs: ['http://xxxx/xxx.jpg', 'http://xxxx/xxx.jpg'],
        height: 100
      }
    ],
    'btns': [
      {
        'type': 'miniprogram', // h5 打开h5页面、miniprogram 跳转其他小程序、path 跳转内部页面、custom 跳客服、showwin 弹窗、share 转发、createorder 下单
        'landing_path': '/pages/detail/detail?product_id=12',
        'app_id': 'wx5739539532',  // 用于miniprogram
        'session_from': 'xxxxxx',  // 用于custom
        'showwin_url': 'http://crowdfunding.in66.com/stc/show/window?window_code=xxx', // 用于showwin 参考万能弹窗
        'share_path': '/pages/detail/detail', // 用于share
        'create_order_url': 'http://xxx/xxx', // 用于createorder
        'create_order_redirect': '/pages/detail/detail', // 用于createorder
        'width': 20, // 20% //用于全部
        'icon': 'http://xxxx/xxx.jpg', // 用于全部  可以不传
        'btn_name': '99.00立即抢购' // 用于全部   可以不传
      }
    ]
  },
  'code': '0',
  'msg': ''
};
