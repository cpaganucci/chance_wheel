function Wheel( canvas )
{
	//constants
	this.MIN_WHEEL_SPEED = 6; //radians per sec
	this.MAX_WHEEL_SPEED = 15;
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

	//events
	var self = this;
	canvas.on( 'mousemove', function( e ){
		self.onMouseMove( e );
	});
	canvas.on( 'mousedown', function(e){
		self.onMouseDown(e);
	});
	canvas.on( 'mouseup', function(e){
		self.onMouseUp(e);
	});
    canvas.bind('touchend', function (e) {
       e.preventDefault();
       self.onMouseUp(e);
    });

  	//init
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

Wheel.prototype.spin = function()
{
	this._isSpinning = true;

	this._initSpeed = this._curSpeed = this.randFloat( this.MIN_WHEEL_SPEED, this.MAX_WHEEL_SPEED );
}

Wheel.prototype.move = function( units )
{
	this._rotationAngle += units * -0.005;
}

Wheel.prototype.resize = function() 
{
	var wedgeAngleHalf = Math.PI / this._choices.length;
	this._wedgeWidth = this.radius * Math.sin( wedgeAngleHalf ) * 2;
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

	if( this._isSpinning )
	{
		this.decelerateWheel( elapsedTime );
		this._rotationAngle += this._curSpeed * elapsedTime;
	}
	
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

	//arrow
	this._context.save();
	this._context.translate( this.centerX - this.radius + 10, this.centerY );
	this._context.beginPath();
	this._context.moveTo( 0, 0 );
	this._context.lineTo( -40, -20 );
	this._context.lineTo( -40, 20 );
	this._context.closePath();
	this._context.fillStyle = '#fff';
	this._context.fill();
	this._context.restore();
}

Wheel.prototype.decelerateWheel = function( t )
{
	if( this._curSpeed > 0.0 )
	{
		var s = this._curSpeed;
		s -= this.DECEL_FACTOR * t;
		var arc = Math.PI * 2 / this._choices.length;
		if( s <= 0 )
		{
			if( ( this._rotationAngle + arc/2 ) % arc < 0.01 )
			{
				this._curSpeed = 0.0;
				this._isSpinning = false;
			}
			else
				this._curSpeed = 0.2;
		}
		else
			this._curSpeed -= this.DECEL_FACTOR * t;
	}
	else
	{
		this._curSpeed = 0.0;
		this._isSpinning = false;
	}
}

Wheel.prototype.onMouseMove = function( e )
{
}

Wheel.prototype.onMouseDown = function( e )
{
}

Wheel.prototype.onMouseUp = function( e )
{
	if( !this._isSpinning )
		this.spin();
}

Wheel.prototype.randInt = function( range )
{
	return Math.floor( Math.random() * range );
}

Wheel.prototype.randFloat = function( min, max )
{
	var range = max - min;
	return min + Math.random() * range;
}
