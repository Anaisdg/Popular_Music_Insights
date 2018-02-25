// Define endpoints 
var citiesUrl = "http://localhost:5000/getCitiesFromMongo?limit=5";

// Define layer arrays for each dataset
var genre_layer_name = "Genre";
var layer2_name = "Gender";
var layer3_name = "Race";

/**
 * Perform GET requests to USGS.gov query URLs using d3.json
 * @param {string} queryURL - URL 
 */
d3.json(citiesUrl, function(data) {
    // Once we get a response, save data to our layer array
    createMaps(data.features)
});

/**
 * Output the map background from Mapbox.com token
 * @param {Object[]} cityMarkers - array of leaflet circle markers
 * @param {Object[]} data - JSON data
 */
function createMaps(features) {
    // 
    // Plot cities on map
    //

    /**
     * Function that runs once for each item in the GeoJSON features array. Used 
     * to show details about GeoJSON feature.
     * @param {*} feature 
     * @param {*} layer 
     */
    function bindFeature(feature, layer) {
        // Put list of top 5 artists into a string list
        var top5 = feature.top_5_artists.join(', ');
        layer.bindPopup("<h3>" + feature.city + "</h3><hr>" + 
            "<table class='popup'><tr><td><b>Top Track:</b></td><td class='data'>" + feature.top_track.name + " (" + feature.top_track.artist + ")</td></tr>" +
            "<tr><td><b>Top Artists:</b></td><td>" + top5 + "</td></tr></table>" +
            "<b>Demographics:</b><blockquote>" +
            "<b>Black:</b> " + feature.perc_black + "% <br />" + 
            "<b>Latino: </b>" + feature.perc_latino + "% <br />" + 
            "<b>Asian: </b>" + feature.perc_asian + "%" + 
            "</blockquote>")
    }

    // Create a GeoJSON layer containing the features array on the object, running 
    //  the onEachFeature() function once for each item in the array. Then, add to map.
    L_cities = L.geoJSON(features, {
        onEachFeature: bindFeature
    })

    // Define streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoic3NjaGFkdCIsImEiOiJjamRoazJlb3QweDRsMnhwZzF4aW0zbWNqIn0.NtBL9Pk91QqV3AjXhGJBQg");

    // Define a baseMaps object to hold our base layer
    var baseMaps = { "Street Map": streetmap };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, L_cities]
    });
    
    //
    // Define Genre overlay names & data
    //

    /**
     * A Function defining the Path options for styling 
     * GeoJSON lines and polygons, called internally when data is added
     * @param {*} feature 
     */
    function styleOverlayLayer(feature) {
        return {
            fillColor: "#ffa9a9",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        };
    }
    /**
     * Function that defines how GeoJSON points spawn Leaflet layers. Internally called 
     *  when data is added, passing the GeoJSON point feature and its LatLng.
     * @param {*} feature 
     * @param {number[]} latlng 
     */
    function bindOverlayLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 30
        });
    }

    // 
    // Genre layer filtering 
    //
    var genreOverlays = {};
    var genreLayers = L.control.layers();
    
    // Get list of all genres and loop through them to generate layer items
    all_genres = getGenres(features);

    // Add filtering layer groups to our Leaflet map object
    for (var i = 0; i < all_genres.length; i++) {  
    //for (var i = 0; i < 1; i++) {
        // Get the genre name and list of cities objects
        var genre_name = all_genres[i].genre;
        var genre_cities = all_genres[i].cities_array;

        // Loop through all markers in the dataset for this genre
        genre_cities.forEach(function (feature) {
            // Check if there's already an overlay for this category
            if (!genreOverlays[genre_name]) {

                // Create and store new layer in overlays object
                genreOverlays[genre_name] = new L.GeoJSON(null, {
                    pointToLayer: bindOverlayLayer,
                    style: styleOverlayLayer
                });
            }

            // Add feature to corresponding layer
            genreOverlays[genre_name].addData(feature);
        }); 
    }      

    //
    // Layer grouping logic 
    //

    // Master layer object
    var overlays = {
        "Genres": genreOverlays
    }
    // Define overlay options 
    var overlaysOptions = {
        groupCheckboxes: true,
        collapsed: false,
        position: 'topright'
    };

    // Add layer filter
    L.control.groupedLayers(null, overlays, overlaysOptions).addTo(myMap);

    // Use d3.selections to add a label to the grouping checkbox
    d3.select(".leaflet-control-layers-group-label").insert("span", ":nth-child(2)").html("<i>Select all</i>");
}

/**
 * Get list of all genres, with matching cities, for the top 5 artists
 * @param {Object[]} data - JSON data
 * @returns {Object[]} genres - List of genres
 */
function getGenres(data) {
    // **** Data format being returned ****
    //   [ 
    //      {
    //          genre:        "Contemporary Country",
    //          cities_array: [ 
    //                          { city 1 },
    //                          { city 2 }
    //                          ...
    //                        ]
    //      },
    //      {
    //          genre:        "West Coast Rap",
    //          cities_array: [ 
    //                          { city 1 },
    //                          { city 2 }
    //                          ...
    //                        ]
    //      }
    //      ...
    //   ]
    var genre_arrays = [];

    // Loop through all cities to create master genre list
    for (var i = 0; i < data.length; i++) {
        // Create stripped-down object for current city
        var cur_city_data = {
            city: data[i].city,
            geometry: data[i].geometry,
            type: data[i].type,
            perc_asian: data[i].perc_asian,
            perc_black: data[i].perc_black,
            perc_latino: data[i].perc_latino,
            top_5_artists: data[i].top_5_artists,
            top_track: data[i].top_track
        }

        // Loop through all top_artists for this city
        for (var c = 0; c < data[i].top_artists.length; c++) {

            if (c < 5) { // Only loop through the top 5 artists (since the list is sorted by popularity we can do this)
                
                // Loop through all artist genres
                for (var g = 0; g < data[i].top_artists[c].genres.length; g++) {
                    // Set current genre name to a variable
                    var cur_genre = data[i].top_artists[c].genres[g];
                        
                    // If we found a "genre_arrays" element for the current genre, grab the 
                    //  'cities_array' out of it, and push cities data to it
                    var cur_genre_array = genre_arrays.find(el => el.genre==cur_genre);
                    if (cur_genre_array) {

                        cur_genre_array.cities_array.push(cur_city_data);
                    
                    // Otherwise, initialize the array element with list containing current city 
                    //  object info
                    } else {
                        genre_arrays.push(
                            { 
                                "genre": cur_genre,
                                "cities_array": [cur_city_data]
                            }
                        );                                
                    }
                
                }
            }

        }
    }

    // Sort the Genres list alphabetically
    genre_arrays.sort(compareGenreNames)

    // Return sorted genres list
    return genre_arrays;
}

/**
 * Sort list alphabetically
 * @param {string} a - value
 * @param {string} b - value
 */
function compareGenreNames(a,b) {
    if (a.genre < b.genre)
      return -1;
    if (a.genre > b.genre)
      return 1;
    return 0;
}

  