/* globals ls,test,cat */
import {
  request,
  get
} from 'https';
import {
  dirname,
  basename
} from 'path';
import {
  blue,
  red
} from 'chalk';
import {
  createReadStream,
  createWriteStream,
  appendFileSync
} from 'fs';
import getEtag from './qiniuHash.js';
import {
  build
} from '../../config';
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
  let prefixDir = `/usr/src/app/${path}`;
  let relativeName = `${path}/${name}`;
  let tinyPath = `${prefixDir}/tiny.json`;
  if ( !test( '-f', tinyPath ) ) {
    appendFileSync( tinyPath, '{}', {
      flag: 'w'
    } );
  }
  var tiny = JSON.parse( cat( tinyPath ) );
  if ( relativeName in tiny && tiny[`${relativeName}`] === hash ) {
    console.log( `CompressDone '${blue( relativeName )}'.....` );
  } else {
    console.log( `StartUpload '${blue( relativeName )}'.....` );
    createReadStream( `${prefixDir}/${name}` ).pipe( request( option, ( res ) => {
      res.on( 'data', resInfo => {
        try {
          resInfo = JSON.parse( resInfo.toString() );
          if ( resInfo.error ) {
            return console.log( `CompressError '${red( relativeName )}'.....${resInfo.message}` );
          }
          var oldSize = ( resInfo.input.size / 1024 ).toFixed( 2 );
          var newSize = ( resInfo.output.size / 1024 ).toFixed( 2 );
          get( resInfo.output.url, imgRes => {
            let writeS = createWriteStream( `${prefixDir}/${name}` );
            imgRes.pipe( writeS );
            imgRes.on( 'end', () => {
              console.log( `CompressSize ${blue( `${oldSize}KB ==> ${newSize}KB -${Math.floor( ( ( oldSize - newSize ) / oldSize * 100 ) )}% ` )}` );
              console.log( `CompressDone '${blue( relativeName )}'.....` );
            } );
            writeS.on( 'close', () => {
              let compressHash = getEtag( `${prefixDir}/${name}` );
              let _tinyData = JSON.parse( cat( tinyPath ) );
              _tinyData[`${relativeName}`] = compressHash;
              appendFileSync( tinyPath, JSON.stringify( _tinyData, null, '\t' ), {
                flag: 'w'
              } );
            } );
          } );
        } catch ( error ) {
          return console.log( `CompressError '${red( relativeName )}'.....${error}` );
        }
      } );
    } ) );
  }
};
ls( './' ).forEach( file => {
  compress( dirname( file ), basename( file ), getEtag( file ) );
} );
