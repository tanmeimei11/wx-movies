const shelljs = require( 'shelljs' );
var https = require( 'https' );
var path = require( 'path' );
var chalk = require( 'chalk' );
var fs = require( 'fs' );
var getEtag = require( './utils' ).getEtag;
const option = {
  hostname: 'tinypng.com',
  port: 443,
  path: '/web/shrink',
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  }
};

/**
 * 获取文件的路径信息
 * @param {*} path
 * @param {*} name
 */
const getFileInfo = ( path, name ) => {
  let _prefixDir = `${shelljs.pwd()}/assets`;
  return {
    prefixDir: _prefixDir,
    relativeName: `${path}/${name}`,
    absoluteName: `${_prefixDir}/${name}`,
    tinyPath: `${_prefixDir}/tiny.json`
  };
};

function getTinyFile ( tinyPath ) {
  if ( !shelljs.test( '-e', tinyPath ) ) {
    fs.appendFileSync( tinyPath, '{}', {
      flag: 'w'
    } );
  }
  return JSON.parse( shelljs.cat( tinyPath ) );
}

const compress = ( path, name ) => {
  if ( /.(json|gitkeep|js)$/.test( name ) ) return '';
  let {
    relativeName,
    absoluteName,
    tinyPath
  } = getFileInfo( path, name );
  var tiny = getTinyFile( tinyPath );

  if ( relativeName in tiny && tiny[`${relativeName}`] === getEtag( absoluteName ) ) {
    console.log( `CompressDone '${chalk.blue( relativeName )}'.....` );
  } else {
    console.log( `StartUpload '${chalk.blue( relativeName )}'.....` );
    fs.createReadStream( `${absoluteName}` ).pipe( https.request( option, ( res ) => {
      res.on( 'data', resInfo => {
        try {
          resInfo = JSON.parse( resInfo.toString() );
          if ( resInfo.error ) {
            return console.log( `CompressError '${chalk.red( relativeName )}'.....${resInfo.message}` );
          }
          var oldSize = ( resInfo.input.size / 1024 ).toFixed( 2 );
          var newSize = ( resInfo.output.size / 1024 ).toFixed( 2 );
          https.get( resInfo.output.url, imgRes => {
            let writeS = fs.createWriteStream( `${absoluteName}` );
            imgRes.pipe( writeS );
            imgRes.on( 'end', () => {
              console.log( `CompressSize ${chalk.blue( `${oldSize}KB ==> ${newSize}KB -${Math.floor( ( ( oldSize - newSize ) / oldSize * 100 ) )}% ` )}` );
              console.log( `CompressDone '${chalk.blue( relativeName )}'.....` );
            } );
            writeS.on( 'close', () => {
              let compressHash = getEtag( `${absoluteName}` );
              let _tinyData = JSON.parse( shelljs.cat( tinyPath ) );
              _tinyData[`${relativeName}`] = compressHash;
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
  compress( path.dirname( file ), path.basename( file ) );
} );
