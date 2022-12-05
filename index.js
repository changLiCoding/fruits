// require file write and read
const fs = require( "fs" );

// require http to create local server 3000
const http = require( "http" );

//  requrire url for create pathname with req.url
const url = require( "url" );



// Blocking, synchronous way
// read file information synchronous version
// const textIn = fs.readFileSync( "./txt/input.txt", "utf-8" )

// const textOut = `This is what we known about the avocado: ${ textIn }. \nCreated on ${ Date.now() }.`;

// write file synchronous version
// fs.writeFileSync( './txt/output.txt', textOut )
// console.log( textOut )

// Non-Blocking, asynchronous way
// fs.readFile( './txt/start.txt', 'utf-8', ( err, data ) => {
//   if ( err ) return console.log( "ERROR! 👹" );

//   fs.readFile( `./txt/${ data }.txt`, 'utf-8', ( err, data1 ) => {
//     console.log( data1 );
//     fs.readFile( './txt/append.txt', 'utf-8', ( err, data2 ) => {
//       console.log( data2 )
//       fs.writeFile( './txt/final.txt', `${ data }\n${ data1 }\n${ data2 }`, 'utf-8', err => {
//         console.log( "Your file has been written! 🧐" )
//       } )
//     } )
//   } )
// } )

// console.log( "🥸Reading file output... " )

// Server
const replaceTemplate = ( temp, product ) => {
  let output = temp.replace( /{%PRODUCTNAME%}/g, product.productName );
  output = output.replace( /{%IMAGE%}/g, product.image );
  output = output.replace( /{%PRICE%}/g, product.price );
  output = output.replace( /{%NUTRIENTS%}/g, product.nutrients );
  output = output.replace( /{%QUANTITY%}/g, product.quantity );
  output = output.replace( /{%ID%}/g, product.id );
  output = output.replace( /{%FROM%}/g, product.from );
  output = output.replace( /{%DESCRIPTION%}/g, product.description );

  if ( !product.organic ) output = output.replace( /{%NOT_ORGANIC%}/g, 'not-organic' );

  return output;
}

const tempOverview = fs.readFileSync( `${ __dirname }/templates/template-overview.html`, 'utf-8' )
const tempCard = fs.readFileSync( `${ __dirname }/templates/template-card.html`, 'utf-8' )
const tempProduct = fs.readFileSync( `${ __dirname }/templates/template-product.html`, 'utf-8' )


const data = fs.readFileSync( `${ __dirname }/dev-data/data.json`, 'utf-8' )
const dataObj = JSON.parse( data )

// fs.readFile( `${ __dirname }/dev-data/data.json`, 'utf-8', ( error, data ) => {
//   if ( error ) return console.log( "ERROR!" );
//   const productData = JSON.parse( data )
// res.writeHead( 200, {
//   'Content-type': 'application/json'
// } );
// res.end( data );
// } );

const server = http.createServer( ( req, res ) => {
  //ES6 destructuring
  const { query, pathname } = url.parse( req.url, true )
  // Overview page

  if ( pathname === '/' || pathname === '/overview' ) {

    res.writeHead( 200, {
      'Content-type': 'text/html'
    } )
    const cardsHtml = dataObj.map( ( value ) => replaceTemplate( tempCard, value ) ).join( '' )

    const output = tempOverview.replace( '{%PRODUCT_CARDS%', cardsHtml );
    res.end( output );

    // Product pages
  } else if ( pathname === '/product' ) {

    const productHtml = replaceTemplate( tempProduct, dataObj[ query.id ] );

    res.writeHead( 200, {
      'Content-type': 'text/html'
    } );
    res.end( productHtml );


    // API page
  } else if ( pathname === '/api' ) {
    res.writeHead( 200, {
      'Content-type': 'application/json'
    } );
    res.end( data );
  }
  // NOT found
  else {
    res.writeHead( 404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    } );
    res.end( '<h1>Page not found! </h1>' )
  }
} );
server.listen( 3000, '127.0.0.1', () => {
  console.log( 'Listening to requests on prot 3000' )
} );
