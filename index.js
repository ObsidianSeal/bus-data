document.querySelector("textarea").addEventListener("input", (e) => {
	try {
		JSON.parse(document.querySelector("textarea").value);
	} catch (error) {
		window.location.reload();
	}

	const busData = JSON.parse(document.querySelector("textarea").value);
	const totalBuses = busData.entity.length;

	let articulated = 0;
	let busDistribution = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		9: 0,
		10: 0,
		12: 0,
		13: 0,
		15: 0,
		16: 0,
		17: 0,
		19: 0,
		20: 0,
		24: 0,
		25: 0,
		27: 0,
		28: 0,
		30: 0,
		31: 0,
		33: 0,
		34: 0,
		35: 0,
		36: 0,
		37: 0,
		38: 0,
		90: 0,
		91: 0,
		92: 0,
		93: 0,
		94: 0,
		102: 0,
		104: 0,
		106: 0,
	};

	// MODEL ARRAYS
	let old40 = [];
	let old60 = [];
	let new40 = [];
	let new60 = [];

	for (let i = 0; i < totalBuses; i++) {
		let busId = parseInt(busData.entity[i].id);
		let routeId = busData.entity[i].vehicle.trip.route_id;
		let latitude = busData.entity[i].vehicle.position.latitude;
		let longitude = busData.entity[i].vehicle.position.longitude;
		let bearing = busData.entity[i].vehicle.position.bearing;
		let direction = busData.entity[i].vehicle.trip.direction_id; // hard to determine what this actually means
		let occupancy = parseInt(busData.entity[i].vehicle.occupancy_percentage);

		if (bearing == 0) bearing = "north";
		if (bearing == 45) bearing = "northeast";
		if (bearing == 90) bearing = "east";
		if (bearing == 135) bearing = "southeast";
		if (bearing == 180) bearing = "south";
		if (bearing == 225) bearing = "southwest";
		if (bearing == 270) bearing = "west";
		if (bearing == 315) bearing = "northwest";

		var model = "<span class='ok'>unknown</span>";
		console.log(old40, busId, old40[0] == busId);
		if (old40.includes(busId)) model = "<span class='bad'>D40LF</span>";
		if (old60.includes(busId)) model = "<span class='bad'>D60LF</span>";
		if (new40.includes(busId)) model = "<span class='good'>XD40</span>";
		if (new60.includes(busId)) model = "<span class='good'>XD60</span>";

		if (occupancy <= 20) occupancy = `<span class='good'>${occupancy}%</span>`;
		else if (occupancy >= 80) occupancy = `<span class='bad'>${occupancy}%</span>`;
		else occupancy = `<span class='ok'>${occupancy}%</span>`;

		if (busId < 100) {
			articulated++;
			addRow(busId, routeId, latitude, longitude, bearing, direction, occupancy, model, "#articulated_buses_table");
		}

		busDistribution[parseInt(routeId)]++;
		addRow(busId, routeId, latitude, longitude, bearing, direction, occupancy, model, "#all_buses_table");
	}

	for (const route in busDistribution) {
		let busString = "";
		for (let i = 0; i < busDistribution[route]; i++) busString = busString + "🚌";

		const row = document.createElement("tr");
		if (route > 100) row.innerHTML = `<td>${route}*</td><td>${busDistribution[route]}</td><td>${busString}</td>`;
		else row.innerHTML = `<td>${route}</td><td>${busDistribution[route]}</td><td>${busString}</td>`;
		document.querySelector("#bus_distribution_table").appendChild(row);
	}

	document.querySelector("#total_bus_count").innerHTML = totalBuses;
	document.querySelector("#articulated_count").innerHTML = articulated;
	document.querySelector("#articulated_percent").innerHTML = Math.round((articulated / totalBuses) * 10000) / 100;

	if (articulated == 1) {
		document.querySelector("#articulated_plural").innerHTML = "is";
		document.querySelector("#info_plural").innerHTML = "that bus:";
	}

	document.querySelector("div").style = "display: block";
});

function addRow(busId, routeId, latitude, longitude, bearing, direction, occupancy, model, table) {
	const row = document.createElement("tr");
	row.innerHTML = `<td>${busId}</td><td>${routeId}</td><td><a href="https://www.openstreetmap.org/search?query=${latitude}%20${longitude}" target="_blank">${latitude} ${longitude} <i class="fa-solid fa-arrow-right-long"></i></a></td><td>${bearing}</td><td>${direction}</td><td>${occupancy}</td><td>${model}</td>`;
	document.querySelector(table).appendChild(row);
}

document.querySelector("a").addEventListener("click", (e) => {
	setTimeout(() => {
		window.location.reload();
	}, 100);
});

document.querySelector("#to_top_button").addEventListener("click", (e) => {
	window.scroll(0, 0);
});

document.addEventListener("scroll", (e) => {
	if (window.scrollY > 300) document.querySelector("#to_top_button").style = "display: flex";
	else document.querySelector("#to_top_button").style = "display: none";
});

// note to self: provide option to sort by different things
// also graph the bus distribution
