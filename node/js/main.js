//constants
var 
NODE_SERVER_IP = 'http://192.168.2.216:1337'
;

var _canvas,
	_list,
	_socket,
	_wheel
;

$(function()
{
    _socket = io.connect( NODE_SERVER_IP );
    _socket.on('connect', function() 
    {
        _socket.on( 'event', function( e )
        {
        	switch( e.type )
        	{
        		case 'list':
        		_list.val( e.list );
        	  	_wheel.updateChoices( e.list );
        	  	break;

        	  	case 'spin':
        	  	_wheel.spin();
        	  	break;

        	  	case 'get':
        	  	_socket.emit( 'event', { type: 'receive', list: _list.val().trim() } );
        	  	break;

        	  	case 'move':
        	  	_wheel.move( parseInt( e.value ) );
         	  	break;
        	}
        });
    });

    _canvas = $('#canvas');
	_wheel = new Wheel( _canvas );
    _wheel.paletteID = 1;
    _wheel.forceEven = true;

	_list = $('#list');
	_list.bind( 'input propertychange', function(){
		updateList();
	});
	_list.val( 'one\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten\neleven\ntwelve\n' );
	updateList();

	$(window).resize( function()
	{
		onResize();
	});
	onResize();
});

function updateList()
{
	var str = _list.val().trim();
	_wheel.updateChoices( str );
}

function onResize() 
{
	var windowWidth, windowHeight;

	windowWidth = $(window).width();
	windowHeight = $(window).height();

	_wheel.resize();

	_canvas.css( 'left', ( windowWidth/2 - _canvas.width()/2 ) + 'px' );
}
