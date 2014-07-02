$(document).ready(function() {
	$('#test').contextMenu({
		option: [{
			name: 'lolololo',
			handler: lol
		}, {
			name: 'separator'
		}, {
			name: 'lalalala',
			handler: lol2,
			option: [{
				name: 'lalalala',
				handler: function() {
					alert('booyeah');
				}
			}]
		}]
	});
});

function lol() {
	console.log('lololoo');
}

function lol2() {
	console.log('lalalalallalalala');
}
