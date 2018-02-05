/* globals ls,test,cat */
const shelljs = require( 'shelljs' );
var https = require( 'https' );
var path = require( 'path' );
var chalk = require( 'chalk' );
var fs = require( 'fs' );
// var getEtag = require( './qiniuHash.js' );
const option = {
  hostname: 'tinypng.com',
  port: 443,
  path: '/web/shrink',
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  }
};
const compress = ( path, name, hash ) => {
  if ( /.(json|gitkeep)$/.test( name ) ) return '';
  let prefixDir = `${shelljs.pwd}/assets`;
  console.log( path, prefixDir );
  let relativeName = `${path}/${name}`;
  let tinyPath = `${prefixDir}/tiny.json`;
  console.log( tinyPath );
  // if ( shelljs.test( '-f', tinyPath ) ) {
  fs.appendFileSync( tinyPath, '{}', {
    flag: 'w'
  } );
  // }
  console.log( tinyPath );
  var tiny = JSON.parse( shelljs.cat( tinyPath ) );
  if ( relativeName in tiny && tiny[`${relativeName}`] === hash ) {
    console.log( `CompressDone '${chalk.blue( relativeName )}'.....` );
  } else {
    console.log( `StartUpload '${chalk.blue( relativeName )}'.....` );
    fs.createReadStream( `${prefixDir}/${name}` ).pipe( https.request( option, ( res ) => {
      res.on( 'data', resInfo => {
        try {
          resInfo = JSON.parse( resInfo.toString() );
          if ( resInfo.error ) {
            return console.log( `CompressError '${chalk.red( relativeName )}'.....${resInfo.message}` );
          }
          var oldSize = ( resInfo.input.size / 1024 ).toFixed( 2 );
          var newSize = ( resInfo.output.size / 1024 ).toFixed( 2 );
          https.get( resInfo.output.url, imgRes => {
            let writeS = fs.createWriteStream( `${prefixDir}/${name}` );
            imgRes.pipe( writeS );
            imgRes.on( 'end', () => {
              console.log( `CompressSize ${chalk.blue( `${oldSize}KB ==> ${newSize}KB -${Math.floor( ( ( oldSize - newSize ) / oldSize * 100 ) )}% ` )}` );
              console.log( `CompressDone '${chalk.blue( relativeName )}'.....` );
            } );
            writeS.on( 'close', () => {
              // let compressHash = getEtag( `${prefixDir}/${name}` );
              let _tinyData = JSON.parse( cat( tinyPath ) );
              _tinyData[`${relativeName}`] = '1';
              fs.appendFileSync( tinyPath, JSON.stringify( _tinyData, null, '\t' ), {
                flag: 'w'
              } );
            } );
          } );
        } catch ( error ) {
          return console.log( `CompressError '${chalk.red( relativeName )}'.....${error}` );
        }
      } );
    } ) );
  }
};
shelljs.ls( 'assets/' ).forEach( file => {
  console.log( file );
  compress( path.dirname( file ), path.basename( file ), '1' );
} );
