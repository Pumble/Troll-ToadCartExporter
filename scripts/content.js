/**
 * Round to 0.5 or 1 closest
 * EG: 0.35 => 0.5, 0.76 => 1
 * @param  float num Number to round-up half 
 * @return float     Number after roud-up half
 */
function roundHalf(num) {
	return Math.round(num*2)/2;
}

/**
 * The name of the cards in the cart page of
 * Trol&Toad includes the code, rarity and the name itself
 * so we need to split that and retrieve the info
 *
 * References:
 * how to clone array: https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/
 * 
 * @param  String name Name to be splited
 * @param  String key  Key name of the data that we want. Aviables: code, rarity, name
 * @return String      Data that we want
 */
function getDataFromName(name, key) {
	var data = name.split(' - ');
	switch(key) {
		case 'code':
			if(data.length > 3) {
				return data[data.length - 2];
			} else {
				return data[1];
			}
			break;
		case 'rarity':
			return data[data.length - 1];
			break;
		case 'name':
			if(data.length > 3) {
				return (data.filter((i,j, a) => j < a.length - 2)).join(' - ');
			} else {
				return data[0];
			}
			break;
		default:
			return data[0];
			break;
	}
}

/**
 * The box name in Troll&Toad includes also the 
 * game name, so split the name and retrieve the info
 * @param  String box Box name that we want to split
 * @param  String key Key name of the data that we want. Aviables: game, expansion
 * @return {[type]}     [description]
 */
function getDataFromBox(box, key) {
	var data = box.split(' - ');
	switch(key) {
		case 'game':
			return data[0];
			break;
		case 'expansion':
			return data[1];
			break;
		
		default:
			return data[0];
			break;
	}
}

/**
 * [cartItemsToCSV description]
 *
 * References:
 * How to create a CSV in JS: https://stackoverflow.com/a/14966131
 * @param  Array rows Array of cart items
 * @return void       Appends a link in the cart footer to donwload the CSV
 */
function cartItemsToCSV(rows) {
	let csvContent = "data:text/csv;charset=utf-8," 
    + rows.map(e => Object.values(e).join(",")).join("\n");

	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "trollAndToad.csv");
	link.setAttribute("class", "text-white");

	var text = document.createTextNode("Donwload CSV");
	link.appendChild(text);

	var container = document.createElement("div");
	container.setAttribute("class", "w-100 p-3");
	container.appendChild(link);

	// link.click(); // This will download the data file named "trollAndToad.csv".

	var cartFooter = document.querySelector('.cart-footer');
	cartFooter.appendChild(container);
}

/**
 * Apply a filter in the given cart items to
 * order cards in the Omega Store CR format
 * @param  Array rows Array of cart items to buy
 * @return Arrat      Formatted array of items
 */
function omegaFilter(rows) {
	var rows = rows.map(function(row, index) {
		return {
			'Cantidad': row.quantity,
			'Nombre de Carta': row.name,
			'Codigo': row.code,
			'Precio Uni.': '$' + row.price,
			'Total': '$' + row.subTotal,
			'Juego': row.game,
			'Expansion': row.box,
			'Foil': row.rarity,
			'Detalles': null
		}
	});
	var headers = ['Cantidad', 'Nombre de Carta', 'Código', 'Precio Uni.', 'Total', 'Juego', 'Expansion', 'Foil', 'Detalles'];
	rows.unshift(headers);
	return rows;
}
// =============================================================================================

var cartItems = document.querySelectorAll(".cart-body .cart-item");

var data = [];
// ci: CartItem
cartItems.forEach(function(ci, index) {
	try {
		var rawName = ci.querySelector('.item-name').innerText;
		var price = parseFloat(ci.querySelector('.d-flex.align-items-center.w-100 .font-smaller:nth-child(4)').innerText.replace('$', ''));
		var quantity = parseInt(ci.querySelector('select').value);
		var box = ci.querySelector('.d-flex.align-items-center.w-100 .font-smaller a').innerText;
		var card = {
			name: getDataFromName(rawName, 'name'),
			code: getDataFromName(rawName, 'code'),
			rarity: getDataFromName(rawName, 'rarity'),

			box: getDataFromBox(box, 'expansion'),
			game: getDataFromBox(box, 'game'),

			quantity: quantity,
			originalPrice: price,			
			price: roundHalf(price),
			subTotal: roundHalf(price) * quantity
		};
		data.push(card);
	} catch(e) {
		console.log('Plugin error with item', index, ci);
	}
});

cartItemsToCSV(omegaFilter(data));

/**
 * TODO:
 * 3- Crear una hoja de google sheets
 * 	3.1- https://developers.google.com/sheets/api/guides/create#javascript
 * 	3.2- https://developers.google.com/sheets/api/guides/values
 *	3.3- https://stackoverflow.com/questions/11871973/can-i-use-google-drive-for-chrome-extensions-not-app
 * 	3.4- https://stackoverflow.com/questions/10330992/authorization-of-google-drive-using-javascript/10331393#10331393
 * 	3.5- https://gsuite-developers.googleblog.com/2012/07/saving-files-to-google-drive-with-web.html
*/