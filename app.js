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

	// Add business markers:
	addMarkers() {
		for(var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	}
}


// Get coordinates via geolocation API:
// Async function code found at https://stackoverflow.com/questions/51843227/how-to-use-async-wait-with-html5-geolocation-api
async function getCoords() {
	const pos = await new Promise((resolve, reject) => {
	  navigator.geolocation.getCurrentPosition(resolve, reject);
	});
	return [pos.coords.latitude, pos.coords.longitude]
}


// Get Foursquare businesses:
// Used code from Foursquare into getFoursquare function to return business results
async function getFoursquare(business) {
	const options = {  // code pulled from Foursquare documentation at https://developer.foursquare.com/reference/place-search
		method: 'GET',
		headers: {
	  		Accept: 'application/json',
	  		Authorization: 'fsq3RMAC4R0VQaW0WlLCXNVPQctaq2GzzdWBi/29vED9GW0='
		}
	}
	let limit = 5  // hardcode number of results to return for selected business
	let lat = myMap.coordinates[0]  // pull coordinates from myMap object to use as lat and lon in fetch request
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?query=${business}&ll=${lat}%2C${lon}&limit=${limit}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

// Process Foursquare array:
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location  // returns object with three properties
	})
	return businesses  // returns array of above objects
}



// Window load:
// Portions of code pulled from https://stackoverflow.com/questions/51843227/how-to-use-async-wait-with-html5-geolocation-api
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}


// Business submit button
// Function created from code at https://wesbos.com/javascript/05-events/prevent-default-and-form-events
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	// Set dusiness option selected (restaurant, coffeee, etc.) and submitted (clicked on) in dropdown as variable
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})