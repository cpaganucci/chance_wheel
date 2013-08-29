var app = require('http').createServer(handler),
	app2 = require('http').createServer(handler2),
	io = require('socket.io').listen(app),
	io2 = require('socket.io').listen( app2 ),
	fs = require('fs'),
	mime = require('mime'),
	_wheelSocket
	;

//var url = __dirname + '/client/index.html';

//app.listen( 1337 );
app.listen( 1337, '192.168.2.216' );
app2.listen( 1338, 'localhost' );

function handler( req, res )
{
	if( req.url == '/' )
		req.url = '/index.html';

	var url;
	if( req.url.indexOf( 'components' ) != -1 || req.url.indexOf( 'libs' ) != -1 )
		url = __dirname + req.url;
	else
		url = __dirname + '/node' + req.url;

	fs.readFile( url, function( err, data ) 
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

function handler2( req, res )
{
}

io.sockets.on('connection', function (socket) 
{
	_wheelSocket = socket;

  socket.on('event', function ( e ) { 
  	console.log( e );
  	socket.broadcast.emit( 'event', e );
  });

  socket.on('disconnect', function () { });
});

io2.sockets.on('connection', function (socket2) 
{
  socket2.on('event', function ( e ) { 
  	console.log( 'YEAAAAAAH:'+e['val'] );		
  	emitWheelMove(parseInt(e['val']));
  });

  socket2.on('disconnect', function () { });
});

function emitWheelMove( val )
{
	_wheelSocket.emit( 'event', { type: 'move', value: val } );
}