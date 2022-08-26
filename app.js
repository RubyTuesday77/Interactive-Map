// Create map object:
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {}, 


	// Build Leaflet map:
	buildMap() {  // Create buildMap function
		// this = myMap object
		this.map = L.map('map', {  // Per Usage example at https://leafletjs.com/reference-1.7.1.html#map-factory
			center: this.coordinates,
			zoom: 11,
		});

		// Add OpenStreetMap tiles:
		// Per Usage example at https://leafletjs.com/reference-1.7.1.html#tilelayer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: '15',
		}).addTo(this.map)

		// Add geolocation marker:
		// Per Usage example at https://leafletjs.com/reference-1.7.1.html#marker
		// L.marker(this.coordinates).addTo(this.map);  
		const marker = L.marker(this.coordinates)  // Commented out above line to declare "marker" as a variable
		marker.addTo(this.map)
		// Bound a popup to marker, to open when clicked
		// Per Usage example at https://leafletjs.com/reference-1.7.1.html#marker
		.bindPopup('<p1><b>You are here</b><br></p1>').openPopup()
	},
}
	// Add business markers



// Get coordinates via geolocation API:
// Async function code found at https://stackoverflow.com/questions/51843227/how-to-use-async-wait-with-html5-geolocation-api
const getCoords = async () => {
	const pos = await new Promise((resolve, reject) => {
	  navigator.geolocation.getCurrentPosition(resolve, reject);
	});
	return [pos.coords.latitude, pos.coords.longitude]
}


// Get Foursquare businesses:



// Process foursquare array:




// Window load:
// Portions of code pulled from https://stackoverflow.com/questions/51843227/how-to-use-async-wait-with-html5-geolocation-api
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	console.log(coords) // check if my coordinates, [35.8987086, -78.8008756] are returned
	myMap.buildMap()
}


// Business submit button
// Function created from code at https://wesbos.com/javascript/05-events/prevent-default-and-form-events
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	// Set dusiness option selected (restaurant, coffeee, etc.) and submitted (clicked on) in dropdown as variable
	let business = document.getElementById('business').value
	console.log(business) // check if submit button click logs selected business
})