/**
 * 格式化时间戳
 * @param {*} date
 * @param {*} isShowWeek
 */
const formatTime = ( _date, isShowWeek ) => {
  var date = new Date( _date );
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${formatNumber( month )}.${formatNumber( day )} `;
};

/**
 * 个位参数加0
 * @param {*} n
 */
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};
/**
 * 获取渠道
 */
const getParamV = ( options, key ) => {
  var scene = options.scene;
  if ( scene ) {
    scene = decodeURIComponent( scene );
    // 'qf=forward_sfsdfd&k=v'
    var paramKVs = scene.split( '&' );
    if ( paramKVs ) {
      for ( var pIndex in paramKVs ) {
        var infoArr = paramKVs[pIndex].split( '=' );
        if ( infoArr[0] === key ) {
          return infoArr[1];
        }
      }
    }
  }
  return '';
};

module.exports = {
  formatTime,
  getParamV
};
