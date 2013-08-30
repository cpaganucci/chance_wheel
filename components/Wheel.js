function Wheel( canvas )
{
	//constants
	this.MIN_WHEEL_SPEED = 6; //radians per sec
	this.MAX_WHEEL_SPEED = 6;
	this.DECEL_FACTOR = 2;

	//http://tools.medialab.sciences-po.fr/iwanthue
	this.PALETTES = 
	[
		[
			"#785B46",
			"#426475",
			"#496B3A",
			"#7A5A7A",
			"#234336",
			"#745F24",
			"#8C4D57",
			"#52343B",
			"#454A1E",
			"#56615A",
			"#90513D",
			"#316957",
			"#2D3D44",
			"#543D1A",
			"#593427",
			"#5A6241",
			"#6F5261",
			"#314225",
			"#4B4029",
			"#6B6134"
		],
		[
			"#ddac26",
			"#f7c41c"
		]
	];

	this.EASTEREGGS = 
	[
		"YOU LOSE!",
		"Spin again",
		"JACKPOT!!!",
		"BANKRUPT",
		"Daily Double",
		"Hell, I don't know...",
		"Ummm... sandwiches?",
		"I'm dizzy...",
		"Make your own damn decisions",
		"Lose a turn",
		"Left foot green"
	];

	//"public" member vars
	this.paletteID = 0;
	this.forceEven = false;
	this.includeEasterEgg = false;
	this.centerX = 0;
	this.centerY = 0;
	this.radius = 0;
	this.font = 'Helvetica';
	this.fontSize = 0.066;
	this.fontHorizontal = false;
	this.hideText = false;
	this.onComplete = function(){}
	this.onSpinStart = function(){}
	this.onSpinEnd = function(){}

	//"private" member vars
	this._canvas = canvas[0];
	this._context = this._canvas.getContext( '2d' );
	this._choices = [];
	this._isSpinning = false;
	this._initSpeed = 0;
	this._curSpeed = 0;
	this._rotationAngle = 0;
	this._lastTime = 0;
	this._wedgeWidth = 0;
	this._wedgeAngle = 0;
	this._swipeStartRotation = 0;
	this._spinDirection = 1;

	// //events
	// var self = this;
	// canvas.on( 'mousemove', function( e ){
	// 	self.onMouseMove( e );
	// });
	// canvas.on( 'mousedown', function(e){
	// 	self.onMouseDown(e);
	// });
	// canvas.on( 'mouseup', function(e){
	// 	self.onMouseUp(e);
	// });
 //    canvas.bind('touchend', function (e) {
 //       e.preventDefault();
 //       self.onMouseUp(e);
 //    });

  	//init
  	jQuery.easing.def = "easeOutCubic";

	this.startRender();
}


////////////////
//public methods
////////////////

Wheel.prototype.updateChoices = function( strList )
{
	this._choices = strList.split('\n');

	if( this.includeEasterEgg || ( this.forceEven && this._choices.length % 2 != 0 ) )
	{
		var rand = this.randInt( this.EASTEREGGS.length - 1 );
		this._choices.push( this.EASTEREGGS[rand] );
	}
}

Wheel.prototype.spin = function( speed )
{
	this._isSpinning = true;

//	this._initSpeed = this._curSpeed = this.randFloat( this.MIN_WHEEL_SPEED, this.MAX_WHEEL_SPEED );
	this._initSpeed = this._curSpeed = speed;

	var duration = 3;
	var curAngle = this._rotationAngle % ( Math.PI * 2 );
	var targetAngle = curAngle + speed * duration;
	var targetWedge = Math.floor( targetAngle / this._wedgeAngle );
	if( targetWedge % 2 != 0 ) //only land on even (dark) slices
		targetWedge++;
	targetAngle = targetWedge * this._wedgeAngle + this._wedgeAngle / 2;
	var self = this;
	$({angle: curAngle}).animate({angle: targetAngle}, {
		duration: duration * 1000,
//		easing: easeOutCubic,
		step: function() {
			self._rotationAngle = this.angle;
		},
		complete: function() {
			self.stopSpin();
		}
	});
}

// Wheel.prototype.move = function( units )
// {
// 	this._rotationAngle += units * -0.005;
// }

Wheel.prototype.resize = function() 
{
	this._wedgeAngle = Math.PI * 2 / this._choices.length;
	this._wedgeWidth = this.radius * Math.sin( this._wedgeAngle / 2 ) * 2;

	this._rotationAngle = this._wedgeAngle / 2;
}

Wheel.prototype.swipe = function( event, phase, direction, distance, duration, fingers )
{
	if( this._isSpinning )
		return;

	if( direction == 'up' || direction == 'down')
		return;

	if( direction == 'left' )
		this._spinDirection = -1;
	else
		this._spinDirection = 1;

	if( phase == 'start' )
	{
		this._swipeStartRotation = this._rotationAngle;
		this.onSpinStart.call();
	}

	else if( phase == 'move' )
	{
		this._rotationAngle = this._swipeStartRotation + parseInt( distance ) * 0.001 * this._spinDirection;
	}

	else if( phase == 'end' )
	{
		if( duration < 500 && distance > 50 )
		{
			this.spin( this.randFloat( this.MIN_WHEEL_SPEED, this.MAX_WHEEL_SPEED ) * this._spinDirection );
		}
		else
		{
			this.settle();
		}
	}
}


/////////////////
//private methods
/////////////////

Wheel.prototype.startRender = function()
{
    this.renderLoop( this );
};

Wheel.prototype.renderLoop = function( self )
{
    this.render();

    requestAnimationFrame( function() { self.renderLoop( self ) }  );
};

Wheel.prototype.render = function()
{
	this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height );

	var timeNow = new Date().getTime() / 1000;
	var elapsedTime = this._lastTime > 0 ? timeNow - this._lastTime : 0;
	this._lastTime = timeNow;

	// if( this._isSpinning )
	// {
	// 	this.decelerateWheel( elapsedTime );
	// 	this._rotationAngle += this._curSpeed * elapsedTime;
	// }
	
	var pct = 1 / this._choices.length;
	var angle = 2 * Math.PI * pct;

	for( var i=0; i<this._choices.length; i++ )
	{
		var start = i * angle + this._rotationAngle;
		if( this._choices.length % 2 == 0 )
			start += angle / 2;

		this._context.beginPath();
		this._context.moveTo( this.centerX, this.centerY );
		this._context.arc( this.centerX, this.centerY, this.radius, start, start + angle, false );
		this._context.closePath();
		this._context.fillStyle = this.PALETTES[this.paletteID][i%this.PALETTES.length];
      	this._context.strokeStyle = '#fff';
		this._context.fill();
		// if( this._choices.length > 1 )
		// 	this._context.stroke();
	}

	if( !this.hideText )
	{
		this._context.save();
		this._context.translate( this.centerX, this.centerY );

		for( var j=0; j<this._choices.length; j++ )
		{
			var start = j * angle + this._rotationAngle;

			this._context.save();

			var fontSize = this.fontSize * this._wedgeWidth;
			this._context.font = fontSize + 'pt ' + this.font;
			this._context.textAlign = 'center';
			var metrics = this._context.measureText( this._choices[j] );

			this._context.rotate( start );
			this._context.translate( -this.radius + ( 4 * fontSize ), 0 );// + metrics.height, 0 );//metrics.width/2 );
			if( this.fontHorizontal )
			{
				this._context.rotate( -Math.PI / 2 );
			}

	      	this._context.fillStyle = '#fff';
			this._context.fillText( this._choices[j], 0, 0 );

			this._context.restore();
		}

		this._context.restore();
	}

	// //arrow
	// this._context.save();
	// this._context.translate( this.centerX - this.radius + 10, this.centerY );
	// this._context.beginPath();
	// this._context.moveTo( 0, 0 );
	// this._context.lineTo( -40, -20 );
	// this._context.lineTo( -40, 20 );
	// this._context.closePath();
	// this._context.fillStyle = '#fff';
	// this._context.fill();
	// this._context.restore();
}

Wheel.prototype.decelerateWheel = function( t )
{
	if( this._isSpinning )
	{
		var s = this._curSpeed;
		s += this.DECEL_FACTOR * t * -this._spinDirection;
		var arc = Math.PI * 2 / this._choices.length;
		if( ( this._spinDirection == 1 && s <= 1 ) || ( this._spinDirection == -1 && s >= -1 ) )
		{
			this._isSpinning = false;
			this.settle();
		}
		else
			this._curSpeed = s;
	}
	// else
	// {
	// 	this.stopSpin();
	// }
}

Wheel.prototype.settle = function()
{
	var curAngle = this._rotationAngle % ( Math.PI * 2 );
	var curWedge = Math.floor( curAngle / this._wedgeAngle );
	if( curWedge % 2 != 0 ) //only land on even (dark) wedge
		curWedge++;
	var targetAngle = curWedge * this._wedgeAngle + this._wedgeAngle / 2;
	var self = this;
	$({angle: curAngle}).animate({angle: targetAngle}, {
		duration: 1000,
		step: function() {
			self._rotationAngle = this.angle;
		},
		complete: function() {
			self.stopSpin();
		}
	});
}

Wheel.prototype.stopSpin = function()
{
	this._curSpeed = 0.0;
	this._isSpinning = false;

	this.onComplete.call();
	this.onSpinEnd.call();
}

// Wheel.prototype.onMouseMove = function( e )
// {
// }

// Wheel.prototype.onMouseDown = function( e )
// {
// }

// Wheel.prototype.onMouseUp = function( e )
// {
// 	if( !this._isSpinning )
// 		this.spin();
// }

Wheel.prototype.randInt = function( range )
{
	return Math.floor( Math.random() * range );
}

Wheel.prototype.randFloat = function( min, max )
{
	var range = max - min;
	return min + Math.random() * range;
}
