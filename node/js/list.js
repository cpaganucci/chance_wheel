var 
_socket,
_panel
;

$(function()
{
    _socket = io.connect( 'http://192.168.2.216:1337' );
    _socket.on('connect', function() 
    {
        _socket.on( 'event', function( e )
        {
        	switch( e.type )
        	{
        		case 'receive':
        		_panel.wheelControlPanel( 'setList',  e.list );
         	  	break;
        	}
        });
    });

	_panel = $('#panel').wheelControlPanel( 
	{ 
		showGetButton: true,
		submit: function()
		{				
			submit();
		},
		get: function()
		{				
			get();
		},
		spin: function()
		{				
			spin();
		}
	});
});	

function updateSavedList()
{
	_saved.html( '<option value="">' + SAVED_LIST_TITLE + '</option>' );
	for( var i in localStorage )
	{
		_saved.append( '<option value="'+localStorage[i]+'">'+i+'</option>' );
	}
}

function submit()
{
	var str = _panel.wheelControlPanel( 'getListString' );
	_socket.emit( 'event', { type: 'list', list: str } );
}

function get()
{
	var str = _panel.wheelControlPanel( 'getListString' );
	_socket.emit( 'event', { type: 'get', list: str } );
}

function spin()
{
	_socket.emit( 'event', { type: 'spin' } );
}