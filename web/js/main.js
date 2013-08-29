//constants
var _canvas,
	_list,
	_wheel
;

$(function()
{
    _canvas = $('#canvas');
	_wheel = new Wheel( _canvas );
    _wheel.paletteID = 1;
    _wheel.forceEven = true;
    _wheel.fontSize = 0.045;
    _wheel.fontHorizontal = true;

	_list = $('#list');
	_list.bind( 'input propertychange', function(){
		updateList();
	});
	var defaults = [
		'Chipotle',
		'Tangerine Tree',
		'Lost Lake',
		'Other Coast',
		'Fish Fry',
		'Bombay Bistro',
		'Rancho Bravo',
		'Ayutthaya',
		'Ballet',
		'Oddfellows'
	];
	_list.val( defaults.join( '\n' ) );
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

	onResize();
}

function onResize() 
{
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	var smaller = Math.min( windowWidth, windowHeight );
	_canvas[0].width = _canvas[0].height = smaller;

	_wheel.centerX = _wheel.centerY = smaller / 2;
	_wheel.radius = _wheel.centerX * 0.9;

	_canvas.css( 'left', ( windowWidth/2 - _canvas.width()/2 ) + 'px' );

	_wheel.resize();
}
