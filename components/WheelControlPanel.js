$.widget( 'dk.wheelControlPanel', 
{
	options: {
		listRows: 15,
		listCols: 20,
		showGetButton: false
	},

	_create: function()
	{
		//constants
		this.SAVED_LIST_TITLE = 'Saved lists...';

		//"private" member vars
		this.list;
		this.savedListMenu;
		this.savedListDropdown;
		this.savedListDropdownInner;

		//init
		var self = this;

		//containers
		var savedDiv = $( '<div id="savedDiv"></div>' );
		var listDiv = $( '<div id="listDiv"></div>' );
		var buttonDiv = $( '<div id="buttonDiv"></div>' );
		this.element.append( savedDiv );
		this.element.append( listDiv );
		this.element.append( buttonDiv );

		//saved list menu
		var savedListDropdownOuter = $('<div id="savedListDropdown"><h3>Saved Lists</h3></div>');
		this.savedListDropdownInner = $('<div></div>');
		savedListDropdownOuter.append( this.savedListDropdownInner );
		this.savedListDropdown = savedListDropdownOuter.accordion( { collapsible: true, active: false, heightStyle: 'content' } );
		savedDiv.html( this.savedListDropdown );
		this._updateSavedList();

		//current list
		this.list = $( '<textarea id="list"></textarea>' );
		this.list.attr( 'rows', this.options.listRows );
		this.list.attr( 'cols', this.options.listCols );
		listDiv.html( this.list );

		//buttons

		//submit button
		var btnSubmit = $( '<input type="button" id="btnSubmit" value="submit"/>' );
		btnSubmit.on( 'click', function()
		{				
			self._trigger( 'submit' );
		});
		buttonDiv.append( btnSubmit );

		//spin button
		var btnSpin = $( '<input type="button" id="btnSpin" value="spin"/>' );
		btnSpin.on('click', function()
		{				
			self._trigger( 'spin' );
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

			self._updateSavedList();
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
					self._updateSavedList();
				}
			}
		});
		savedDiv.append( btnDelete );

		//get button
		if( this.options.showGetButton )
		{
			var btnGet = $( '<input type="button" id="btnGet" value="get"/>' );
			btnGet.on('click', function()
			{				
				self._trigger( 'get' );
			});
			buttonDiv.append( btnGet );
		}

		$('#saved').on( 'menuselect', function( event, ui )
		{
			var name = ui.item.text();
			if( name != '' )
			{
				self.list.val( localStorage[name] );
				self._trigger( 'submit' );
				self.savedListDropdown.accordion( 'option', 'active', false );
			}
		});

		//this._updateSavedList();
	},


	/////////////////
	//public methods
	/////////////////

	setList: function( str )
	{
		return this.list.val( str );
	},

	getListString: function()
	{
		return this.list.val().trim();
	},

	/////////////////
	//private methods
	/////////////////

	_updateSavedList: function()
	{
		this.savedListDropdownInner.html('');
		var tempMenu = $( '<ul id="saved"></ul>' );
		for( var i in localStorage )
		{
			tempMenu.append( '<li><a href="#">' + i + '</a></li>' );
		}
		this.savedListMenu = tempMenu.menu();
		this.savedListDropdownInner.append( this.savedListMenu );

		this.savedListDropdown.accordion( 'refresh' );
	}
});
