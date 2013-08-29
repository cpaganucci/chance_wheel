var nodeServer = require( 'http' ).createServer( nodeServerRequestHandler ),
	phidgetsServer = require( 'http' ).createServer(),
	nodeIO = require( 'socket.io' ).listen( nodeServer ),
	phidgetsIO = require( 'socket.io' ).listen( phidgetsServer ),
	fileServer = require( 'fs' ),
	mime = require( 'mime' ),
	wheelSocket
	;

nodeServer.listen( 1337, '192.168.2.216' );
phidgetsServer.listen( 1338, 'localhost' );

function nodeServerRequestHandler( req, res )
{
	if( req.url == '/' )
		req.url = '/index.html';

	var url;
	if( req.url.indexOf( 'components' ) != -1 || req.url.indexOf( 'libs' ) != -1 )
		url = __dirname + req.url;
	else
		url = __dirname + '/node' + req.url;

	fileServer.readFile( url, function( err, data ) 
	{
		if( err )
		{
			res.writeHead( 500 );
			return res.end( 'Error loading url: ' + url );
		}

		var mimeType = mime.lookup( url );

		res.setHeader( 'Content-Type', mimeType );
		res.writeHead( 200 );
		res.end( data );
	});
}

nodeIO.sockets.on('connection', function (socket) 
{
	wheelSocket = socket;

	socket.on('event', function ( e ) 
	{ 
  		console.log( e );
  		socket.broadcast.emit( 'event', e );
  	});

//	socket.on('disconnect', function () { });
});

phidgetsIO.sockets.on('connection', function (socket2) 
{
	socket2.on('event', function ( e ) 
	{ 
		emitWheelMove( parseInt( e['val'] ) );
	});

//	socket2.on('disconnect', function () { });
});

function emitWheelMove( val )
{
	if( wheelSocket )
	{
		wheelSocket.emit( 'event', { type: 'move', value: val } );
	}
}