;
(function($, window, document, undefined) {
	var pluginName = "contextMenu",
	defaults = {
		selector: '#contextmenu',
		option: [{
			name: 'option a',
			handler: function() {
				console.log('option a');
			}
		}, {
			name: 'separator',
		}, {
			name: 'option b',
			handler: function() {
				console.log('option b');
			},
			option: [{
				name: 'option ba',
				handler: function() {
					console.log('option ba');
				}
			}, {
				name: 'option bb',
				handler: function() {
					console.log('option bb');
				}
			}]
		}, {
			name: 'option c',
			icon: '',
			handler: function() {
				console.log('option c');
			}
		}]
	};
	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}
	$.extend(Plugin.prototype, {
		init: function() {
			var self = this,
			el = $(this.element),
			settings = this.settings,
			contextmenu = settings.selector;
			if ($(contextmenu).length === 0) {
				var mainmenu = self.createOptionChild(settings.option);
				mainmenu.addClass('contextmenu');
				mainmenu.prop('id', contextmenu.replace('#', ''));
				mainmenu.appendTo('body');
			}
			el.on('mousedown', function(e) {
				setTimeout( function(){
					if (e.which == 3) {
						$(document).one('contextmenu', function(e) {
							e.preventDefault();
						});
						$(contextmenu).css({
							top: e.pageY,
							left: e.pageX
						}).show();
					}
				}, 10);
			});
			$(document).on('mousedown', function(e) {
				self.closeContextMenu();
			});
			$(contextmenu).on('contextmenu', function(e) {
				e.preventDefault();
			});
			$(contextmenu).on('mousedown', 'li', function(e) {
				e.stopPropagation();
				var i = 0,
				parents = $(this).parentsUntil(contextmenu),
				indexes = [$(this).index()];
				for (i = 1; i < parents.length; i++) {
					indexes.unshift($(parents[i]).index());
				}
				var option = settings.option;
				for (i = 0; i < indexes.length; i++) {
					if (option[indexes[i]].option !== undefined) {
						option = option[indexes[i]].option;
					} else {
						option = option[indexes[i]];
					}
				}
				if (option.handler !== undefined && option.name !== 'separator') {
					option.handler();
					self.closeContextMenu();
				}
			});
			$(contextmenu).on('click', function(e) {
				e.stopPropagation();
			});
		},
		createOptionChild: function(option) {
			var ul = $('<ul>'),
			li;
			for (var i = 0; i < option.length; i++) {
				if (option[i].name === 'separator') {
					li = $('<li>', {
						class: 'separator'
					});
				} else {
					if ( option[i].icon !== undefined ){
						li = $('<li>');
						$('<span>',{
							'class': 'icon',
							html: option[i].icon
						}).appendTo(li);
						$('<span>', {
							'class': 'option',
							text: option[i].name
						}).appendTo(li);
					} else {
						li = $('<li>', {
							text: option[i].name
						});
					}
				}
				if (option[i].option !== undefined) {
					this.createOptionChild(option[i].option).appendTo(li);
				}
				li.appendTo(ul);
			}
			return ul;
		},
		closeContextMenu: function() {
			var settings = this.settings,
			contextmenu = settings.selector;
			$(contextmenu).hide();
		}
	});
$.fn[pluginName] = function(options) {
	this.each(function() {
		if (!$.data(this, "plugin_" + pluginName)) {
			$.data(this, "plugin_" + pluginName, new Plugin(this, options));
		}
	});
	return this;
};
})(jQuery, window, document);
