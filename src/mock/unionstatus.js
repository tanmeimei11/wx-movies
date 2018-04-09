module.exports = {
  'timestamp': '1522829432',
  'succ': true,
  'data': {
    'union_result': {
      'is_show': false,
      union_result_desc: '134321423',
      union_class: 'fail',
      union_tips: '13241324'
    },
    'joiners': [],
    'union_ing_result': {
      union_need_count: 3,
      union_remain_time: 6, // 倒计时剩余秒数
      is_show: false
    },
    'btns': [{
      btn_tip: '团长免单', // 团长免单提示
      'btn_callback': {
        'btn_api_url': '/mnp/union/launch',
        'btn_api_params': {
          share_buried_point: 'share_kaituan'
        }
      },
      'btn_name': '立即开团',
      'btn_path': '',
      'btn_color': 'btn-union',
      'btn_type': '2'
    }, {
      'btn_pay': {
        'btn_api_url': '/mnp/order/create_common',
        'btn_api_params': {
          'product_id': '202',
          pay_buried_point: 'union' // union   oringal
        }
      },
      'btn_name': '原价35元购买 ',
      'btn_path': '/mnp/order/create_union',
      'btn_color': 'btn-buy',
      'btn_type': '3'
    }]
  },
  'code': '0',
  'msg': ''
};
