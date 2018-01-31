module.exports = {
  'msg': '',
  'code': '0',
  'succ': true,
  'data': {
    'is_owner': false, // 是否分享者本人, is_owner优先级大于can_get
    'can_get': true, // 是否可以领取
    'user_info': {
      'avatar': 'http://mmx.jpg', // 头像
      'nick_name': '一休'
    },
    'msg': '来晚一步了,已被别人领取了' // 只有在can_get为false的情况下使用
  },
  'timestamp': '1516094687'
};
