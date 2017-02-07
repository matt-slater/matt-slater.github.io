var directionsDisplay,
    directionsService,
    geocoder,
    map,
    style = STYLE;

function initMap() {
    //"use strict";
    directionsDisplay = new google.maps.DirectionsRenderer();
    var nyc = new google.maps.LatLng(40.761297, -73.980379),
        myOptions = {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: nyc,
            styles: style,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("panel"));
    directionsService = new google.maps.DirectionsService();
    geocoder = new google.maps.Geocoder();

    var autocomplete, autocomplete2;

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('pickup')), {
            types: ['geocode']
        });
    autocomplete2 = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('dropoff')), {
            types: ['geocode']
        });

    //  ac1 = new google.maps.places.Autocomplete(
    // /** @type {!HTMLInputElement} */(document.getElementById('dropoff')),
    // {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    //autocomplete.addListener('place_changed', fillInAddress);

    function geolocate() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                autocomplete.setBounds(circle.getBounds());
            });
        }
    }

}

function calcRoute() {
    //"use strict";
    var start = document.getElementById("pickup").value,
        end = document.getElementById("dropoff").value,
        distanceInput = document.getElementById("distance"),
        timeInput = document.getElementById("time"),
        outsideNYC = document.getElementById("check"),
        nyc = new google.maps.LatLng(40.761297, -73.980379),
        m2m = document.getElementById("m2m"),
        request = {},
        shortIndex;

    if (outsideNYC.checked) {
        request = {
            origin: nyc,
            destination: end,
            waypoints: [{
                location: start,
                stopover: false
            }],
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            durationInTraffic: true,
            provideRouteAlternatives: true
        };
    } else if (m2m.checked) {
        request = {
            avoidHighways: true,
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING,
            durationInTraffic: true,
            provideRouteAlternatives: true
        };
    } else {
        request = {
            avoidHighways: false,
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING,
            durationInTraffic: true,
            provideRouteAlternatives: true
        };
    }

    directionsService.route(request, function(response, status) {


        if (status == google.maps.DirectionsStatus.OK) {
            shortIndex = findShortestRoute(response);
            // alert('route index is: ' + shortIndex + '');

            directionsDisplay.setDirections(response);
            directionsDisplay.setOptions({
                draggable: false,
                routeIndex: shortIndex,
                polylineOptions: {
                    strokeColor: '#ff9933',
                    strokeWeight: 5,
                    strokeOpacity: 0.75
                }
            });
            // alert('value of route display: ' + directionsDisplay.getRouteIndex() + '');
            var miles = (response.routes[shortIndex].legs[0].distance.value / 1000) * 0.62137,
                time = response.routes[shortIndex].legs[0].duration.text;

            distanceInput.innerHTML = response.routes[shortIndex].legs[0].distance.text;

            timeInput.innerHTML = time;
            calcQuote(miles, time);


        }
    });
}

function calcQuote(d, t) {
    //"use strict";

    var quote = document.getElementById("quote_holder"),
        afterHours = document.getElementById("afterHours"),
        baseFare = document.getElementById("baseFare"),
        tip = document.getElementById("tip"),
        tolls = document.getElementById("tolls"),
        totalFare = document.getElementById("totalFare"),
        expression = 0,
        tipJS = 0,
        tollsJS = 0,
        totalJS = 0;

    if (d < 12) {
        expression = 5 * (Math.floor(Math.abs((40 + (((d) * 10) * 0.5)) / 5)));

        tollsJS = 0;
        if (d <= 1) {
            expression = 40;
            tollsJS = 0;
        }
    } else
    if (d >= 12 && d < 25) {

        expression = (d * 3.75) + 60;
        tollsJS = (expression * 1.2) * 0.05;



    } else if (d >= 25 && d < 50) {
        expression = (d * 4) + 30;
        tollsJS = (expression * 1.2) * 0.05;
    } else if (d >= 50 && d < 150) {
        expression = (d * 3.50);
        tollsJS = (expression * 1.2) * 0.05;

    } else if (d >= 150 && d < 250) {
        expression = (d * 2.25);
        tollsJS = (expression * 1.2) * 0.05;
    } else if (d >= 250 && d < 1000) {
        expression = (d * 1.75);
        tollsJS = (expression * 1.2) * 0.05;
    } else if (d >= 1000) {
        expression = (d * 1.50);
        tollsJS = (expression * 1.2) * 0.05;
    }

    if (afterHours.checked) {
        expression = expression * 1.25;
    }
    expression = expression.toFixed(2);
    expression = Math.round(expression);
    expression = expression + 2;
    tipJS = (expression * 0.2).toFixed(2);
    tollsJS = parseFloat(tollsJS).toFixed(2);
    totalJS = (Number(expression) + Number(tipJS) + Number(tollsJS));
    console.log(totalJS);
    totalJS = parseFloat(totalJS).toFixed(2);


    //quote.innerHTML = ('$' + expression + '');
    baseFare.innerHTML = ('$' + expression + '');
    tip.innerHTML = ('$' + tipJS + '');
    tolls.innerHTML = ('$' + tollsJS + '');
    totalFare.innerHTML = ('$' + totalJS + '');


}

function secondsToTime(s) {
    var time = s;
    return time;
}

function findShortestRoute(responseObject) {
    // "use strict";
    var value = responseObject.routes[0].legs[0].distance.value,
        i,
        index,
        distanceArray = [];

    for (i = 0; i < responseObject.routes.length; i++) {
        distanceArray[i] = responseObject.routes[i].legs[0].distance.value;
    }

    value = Math.min.apply(null, distanceArray);


    index = distanceArray.indexOf(value);
    //alert('route distances are: ' + distanceArray[0] + ', ' + distanceArray[1] + ', ' + distanceArray[2] + ', index is: ' + index + ', value is: ' + value + '');
    return index;

}
