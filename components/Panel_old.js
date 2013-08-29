function Panel( div )
{
	//constants
	this.SAVED_LIST_TITLE = 'Saved lists...';

	//"public" member vars
	this.listRows = 15;
	this.listCols = 20;
	this.showGetButton = false;

	//"private" member vars
	this.div = div;
	this.list;
	this.savedListMenu;
}

Panel.prototype.init = function()
{
	var self = this;

	//containers
	var savedDiv = $( '<div id="savedDiv"></div>' );
	var listDiv = $( '<div id="listDiv"></div>' );
	var buttonDiv = $( '<div id="buttonDiv"></div>' );
	this.div.append( savedDiv );
	this.div.append( listDiv );
	this.div.append( buttonDiv );

	//saved list menu
	// var savedListDropdown = '
	// 	<div id="savedListDropdown">
	// 		<h3>Saved Lists</h3>
	// 		<div>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</div>
	// 	</div>	
	// ';
	this.savedListMenu = $( '<select id="saved"></select>' );
	savedDiv.html( this.savedListMenu );

	//current list
	this.list = $( '<textarea id="list"></textarea>' );
	this.list.attr( 'rows', this.listRows );
	this.list.attr( 'cols', this.listCols );
	listDiv.html( this.list );

	//buttons

	//submit button
	var btnSubmit = $( '<input type="button" id="btnSubmit" value="submit"/>' );
	btnSubmit.on( 'click', function()
	{				
		self.div.trigger( 'submit' );
	});
	buttonDiv.append( btnSubmit );

	//spin button
	var btnSpin = $( '<input type="button" id="btnSpin" value="spin"/>' );
	btnSpin.on('click', function()
	{				
		self.div.trigger( 'spin' );
	});
	buttonDiv.append( btnSpin );

	//save button
	var btnSave = $( '<input type="button" id="btnSave" value="save"/>' );
	btnSave.on('click', function()
	{
		var list = self.list.val().trim();
		var name = prompt( 'Name your list', '' );
		if( name != '' )
			localStorage[name] = list;

		self.updateSavedList();
	});
	savedDiv.append( btnSave );

	//delete button
	var btnDelete = $( '<input type="button" id="btnDelete" value="delete"/>' );
	btnDelete.on('click', function()
	{
		var name = $('#saved option:selected').text();
		if( name != self.SAVED_LIST_TITLE )
		{
			if( confirm( 'Delete \'' + name + '\'?' ) )
			{
				localStorage.removeItem( name );
				self.updateSavedList();
			}
		}
	});
	savedDiv.append( btnDelete );

	//get button
	if( this.showGetButton )
	{
		var btnGet = $( '<input type="button" id="btnGet" value="get"/>' );
		btnGet.on('click', function()
		{				
			self.div.trigger( 'get' );
		});
		buttonDiv.append( btnGet );
	}

	var self = this;
	this.savedListMenu.change( function()
	{
		var name = $('#saved option:selected').text();
		if( name != '' )
		{
			self.list.val( localStorage[name] );
			self.div.trigger( 'submit' );
		}
	});

	this.updateSavedList();
}


/////////////////
//public methods
/////////////////

Panel.prototype.setList = function( str )
{
	return this.list.val( str );
}

Panel.prototype.getListString = function()
{
	return this.list.val().trim();
}

/////////////////
//private methods
/////////////////

Panel.prototype.updateSavedList = function()
{
	this.savedListMenu.html( '<option value="">' + this.SAVED_LIST_TITLE + '</option>' );
	for( var i in localStorage )
	{
		this.savedListMenu.append( '<option value="'+localStorage[i]+'">'+i+'</option>' );
	}
}
