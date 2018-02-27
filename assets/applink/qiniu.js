const shelljs = require( 'shelljs' );
const Path = require( 'path' );
const fs = require( 'fs' );
const https = require( 'https' );
const utils = require( '../utils' );
const chalk = require( 'chalk' );
const ora = require( 'ora' );

const qiniuReUrl = key => `https://inimg01.jiuyan.info/${key}`;
const qnTokenUrl = 'https://www.in66.com/promo/commonapi/qiniutoken';
const qiniuUpload = ( path, tokenRes ) => new Promise( resolve => https.request( {
  hostname: 'up.qbox.me',
  port: 443,
  path: `/putb64/-1/key/${tokenRes.key}`,
  method: 'POST',
  headers: {
    Authorization: `UpToken ${tokenRes.token}`,
    contentType: 'application/octet-stream'
  }
}, utils.resResolve( resolve ) ).end( fs.readFileSync( path ).toString( 'base64' ) ) );
const qiniuYun = ( { path, name } ) => new Promise( resolve => https.get( qnTokenUrl, utils.resResolve( resolve ) ) ).then( async token => {
  if ( !token.succ ) throw new Error( token.message );
  const { key } = await qiniuUpload( `${path}/${name}`, token.data );
  return qiniuReUrl( key );
} );

const handler = async argv => {
  const spinner = ora( '开始查找文件' ).start();
  const files = shelljs.ls( );

  spinner.info( `找到[${files.length}]个文件` );
  files.forEach( async file => {
    const path = Path.dirname( file );
    const name = Path.basename( file );
    const hash = utils.getEtag( file );
    const blueName = chalk.blue( `${path}/${file}` );
    let qiniuPath = `${path}/.qnrc`;
    if ( !shelljs.test( '-f', qiniuPath ) ) fs.appendFileSync( qiniuPath, '{}', { flag: 'w' } );
    spinner.start( `开始上传 ${blueName}` );
    try {
      let qiniuData = JSON.parse( shelljs.cat( qiniuPath ) );
      const qiniuUrl = utils.hasUpload( name, qiniuData, hash ) ? qiniuData[`${name}`].qiniuUrl : await qiniuYun( { path, name } );
      qiniuData = JSON.parse( shelljs.cat( qiniuPath ) );
      qiniuData[name] = { hash, qiniuUrl };
      fs.appendFileSync( qiniuPath, JSON.stringify( qiniuData, null, '\t' ), { flag: 'w' } );
      spinner.succeed( `上传成功 ${blueName}` ).start().info( `七牛地址: ${qiniuUrl}` );
    } catch ( error ) {
      spinner.fail( `上传失败 ${chalk.red( `${path}/${file}` )}` );
    }
  } );
};

handler();
