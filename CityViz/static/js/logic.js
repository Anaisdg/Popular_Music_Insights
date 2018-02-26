// Define endpoints 
var citiesUrl = "http://localhost:5000/getCitiesFromMongo"; // ?limit=5";

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
            "<b>African-American:</b> " + feature.perc_black + "% <br />" + 
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
    // *** Define Genre overlay names & data ***
    // 
    // Genre layer creation - Get list of all genres and loop through them to generate layer items
    //
    var genre_arrays = getCategories("genre", features);
    genreOverlays = createLayers(genre_arrays);

    //
    // Race layer creation - Get list of all races and loop through them to generate layer items
    //
    var race_arrays = getCategories("race", features);
    raceOverlays = createLayers(race_arrays);

    //
    // Layer grouping logic 
    //
    // Master layer object
    var overlays = {
        "Races": raceOverlays,
        "Genres": genreOverlays
    }
    // Define overlay options 
    var overlaysOptions = {
        groupCheckboxes: true,
        collapsed: true,
        position: 'bottomright'
    };

    // Add layer filter
    L.control.groupedLayers(null, overlays, overlaysOptions).addTo(myMap);

    // Use d3.selections to add a label to the grouping checkbox
    d3.selectAll(".leaflet-control-layers-group-label").insert("span", ":nth-child(2)").html("<i>Select all</i>");
}

/**
 * From list of category-specific arrays, add layer options to map
 * @param {Object[]} data - JSON data
 * @returns {Object} - catOverlays object
 */
function createLayers(category_arrays) {
    var catOverlays = {};

    // Add filtering layer groups to our Leaflet map object
    for (var i = 0; i < category_arrays.length; i++) {  

        // Get the category name and list of cities objects
        var cat_name = category_arrays[i].category;
        var cat_cities = category_arrays[i].cities_array;

        // Loop through all markers in the dataset for this category
        cat_cities.forEach(function (feature) {
            // Check if there's already an overlay for this category
            if (!catOverlays[cat_name]) {

                // Create and store new layer in overlays object
                catOverlays[cat_name] = new L.GeoJSON(null, {
                    pointToLayer: bindOverlayLayer,
                    style: styleOverlayLayer
                });
            }

            // Add feature to corresponding layer
            catOverlays[cat_name].addData(feature);
        }); 
    }
    
    return catOverlays;
}

/**
 * Get list of all categories ("genres" or "races"), with matching cities arrays, for the top 5 artists
 * @param {string} type - Type of category (e.g., "genre", "race")
 * @param {Object[]} data - JSON data
 * @returns {Object[]} cat_arrays - List of categories
 */
function getCategories(type, data) {
    // **** Data format being returned ****
    //   [ 
    //      {
    //          category:     "Contemporary Country",
    //          cities_array: [ 
    //                          { city 1 },
    //                          { city 2 }
    //                          ...
    //                        ]
    //      },
    //      {
    //          category:        "West Coast Rap",
    //          cities_array: [ 
    //                          { city 1 },
    //                          { city 2 }
    //                          ...
    //                        ]
    //      }
    //      ...
    //   ]

    // Initialize array variables
    var cat_arrays = [];
    var races = ["White", "African-American", "Latino"]; 

    // Loop through all cities to create master category list
    for (var c = 0; c < data.length; c++) {
        // Create stripped-down object for current city
        var cur_city_data = {
            city: data[c].city,
            geometry: data[c].geometry,
            type: data[c].type,
            perc_asian: data[c].perc_asian,
            perc_black: data[c].perc_black,
            perc_latino: data[c].perc_latino,
            top_5_artists: data[c].top_5_artists,
            top_track: data[c].top_track
        }

        // Loop through all top_artists for this city
        for (var a = 0; a < data[c].top_artists.length; a++) {

            if (a < 5) { // Only loop through the top 5 artists (since the list is sorted by popularity we can do this)
            
                // Set the looping variable for our inner loop according to the list type
                if (type == "genre") {
                    var categories = data[c].top_artists[a].genres;

                    // Loop through all artist categories
                    for (var i = 0; i < categories.length; i++) {
                        // Set current category name to a variable
                        var cur_category = categories[i];
                            
                        // If we found a "cat_arrays" element for the current category, grab the 
                        //  'cities_array' out of it, and push current city data to it
                        var cur_cat_array = cat_arrays.find(el => el.category==cur_category);
                        if (cur_cat_array) {

                            cur_cat_array.cities_array.push(cur_city_data);
                        
                        // Otherwise, initialize the array element with list containing current city 
                        //  object info
                        } else {
                            cat_arrays.push(
                                { 
                                    "category": cur_category,
                                    "cities_array": [cur_city_data]
                                }
                            );                                
                        }                
                    }
                    
                } else if (type == "race") {
                    var categories = races;

                    // Grab the static 'race' or 'gender' value
                    var cur_race = data[c].top_artists[a].race;

                    // If we found a "cat_arrays" element for the current category, grab the 
                    //  'cities_array' out of it, and push current city data to it
                    var cur_cat_array = cat_arrays.find(el => el.category==cur_race);
                    if (cur_cat_array) {

                        cur_cat_array.cities_array.push(cur_city_data);
                    
                    // Otherwise, initialize the array element with list containing current city 
                    //  object info
                    } else {
                        cat_arrays.push(
                            { 
                                "category": cur_race,
                                "cities_array": [cur_city_data]
                            }
                        );                                
                    }    
                }
                
            }

        }
    }

    // Sort the category list alphabetically
    cat_arrays.sort(compareCatNames)

    // Return sorted category list
    return cat_arrays;
}

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

/**
 * Sort list alphabetically
 * @param {string} a - value
 * @param {string} b - value
 */
function compareCatNames(a,b) {
    if (a.category < b.category)
      return -1;
    if (a.category > b.category)
      return 1;
    return 0;
}

  