//constants
var WEDGE_SCREEN_PCT = .617;

//vars
var _canvas,
	_list,
	_wheel,
	_introDiv,
	_resultDiv,
	_resultText,
	_btnMoreInfo,
	_arrowDiv
;

$(function()
{
    _canvas = $('#canvas');
	_wheel = new Wheel( _canvas );
    _wheel.paletteID = 1;
    _wheel.hideText = true;
    // _wheel.forceEven = true;
    // _wheel.font = 'Abril Fatface'
    // _wheel.fontSize = 0.07;
    // _wheel.fontHorizontal = true;
    _wheel.onComplete = function()
    {
    	onWheelComplete();
    }
    _wheel.onSpinStart = function()
    {
    	onSpinStart();
    }
    _wheel.onSpinEnd = function()
    {
    	onSpinEnd();
    }

    //wheel expects a list of items separated by a newline
    //we'll put in 10 dummy items that won't appear
    var str = '';
    for( var i=0; i<9; i++ )
    {
    	str += i + '\n';
    }
	_wheel.updateChoices( str );

	_introDiv = $('#introDiv');
	_arrowDiv = $('#arrowDiv');
	_resultDiv = $('#resultDiv');
	_resultDiv.hide();
	_resultText = $('#resultText');

	_btnMoreInfo = $('#btnMoreInfo');
	_btnMoreInfo.click( function( e )
	{
		e.stopPropagation();
		onBtnMoreInfo();
	});

	$('#mainContainer').swipe({
		swipeStatus: swipe,
		allowPageScroll: 'vertical'
	})

	$(window).resize( function()
	{
		onResize();
	});
	onResize();
});

function onWheelComplete()
{
	_resultText.html( 'This is a really long Result' );
}

function onSpinStart()
{
	_introDiv.fadeOut( 'slow' );
	_resultDiv.fadeOut( 'slow' );
	_arrowDiv.fadeOut( 'slow' );
}

function onSpinEnd()
{
	_resultDiv.fadeIn( 'slow' );
	_arrowDiv.fadeIn( 'slow' );
}

function onBtnMoreInfo()
{

	var url = 'http://google.com';
	window.open( url, '_blank' ); 
}

function swipe( event, phase, direction, distance, duration, fingers )
{
	_wheel.swipe( event, phase, direction, distance, duration, fingers );
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
