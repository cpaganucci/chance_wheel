//constants
var WEDGE_SCREEN_PCT = .617;

//vars
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
    _wheel.font = 'Abril Fatface'
    _wheel.fontSize = 0.07;
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

	var canvasTop = windowHeight * 0.45;
	_canvas[0].width = windowWidth;
	_canvas[0].height = windowHeight - canvasTop;
	_canvas.css( 'top', canvasTop + 'px' );

	var wedgeWidthHalf = WEDGE_SCREEN_PCT * windowWidth / 2;
	var wedgeAngleHalf = Math.PI / _wheel._choices.length;
	var r1 = wedgeWidthHalf / Math.sin( wedgeAngleHalf );
	var r2 = _canvas.height() * 2.2;
	var radius = Math.min( r1, r2 );

	_wheel.radius = radius;
	_wheel.centerX = _canvas.width() / 2;
	_wheel.centerY = _wheel._outerRadiusPx = radius;
	_wheel.resize();
}
