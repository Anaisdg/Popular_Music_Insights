// Define endpoints. (Use querystring syntax "?limit=[count]", when limiting dataset)
var citiesUrl = "http://localhost:5000/getCitiesFromMongo"; 

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
    // Genre overlay names & data
    // 
    // Genre layer creation - Get list of all genres and loop through them to generate layer items
    var genre_arrays = getCategories("genre", features);
    genreOverlays = createLayers(genre_arrays, "genre");

    //
    // Race layer creation - Get list of all races and loop through them to generate layer items
    //
    var race_arrays = getCategories("race", features);
    raceOverlays = createLayers(race_arrays, "race");

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
        collapsed: false,
        position: 'bottomright'
    };

    // Add layer filter
    var grp = L.control.groupedLayers(null, overlays, overlaysOptions).addTo(myMap);

    // Use d3.selections to add a label to the grouping checkbox
    d3.selectAll(".leaflet-control-layers-group-label").insert("span", ":nth-child(2)").html("<i>Select all</i>");
    
    /** Map layer overlay "add" event */
    myMap.on('overlayadd', function(overlay) {
        updateOverlayCounts(overlay, "add");
    });

    /** Map layer overlay "remove" event */
    myMap.on('overlayremove', function(overlay) {
        updateOverlayCounts(overlay, "remove");
    });

    /**
     * Perform "add" or "remove" actions on city-specific overlay circles, to assign city counts
     *  for the selected layer (e.g., "Chillwave", "Country", "African-American")
     * @param {Object} overlay - Current overlay object being updated
     * @param {string} action - Type of event ('remove' or 'add')
     */
    function updateOverlayCounts(overlay, action) {
        var num_selected = 0;  // Initialize number of selected checkboxes variable

        // Get layer type being applied
        var layer_type = overlay.group.name;
        console.log(layer_type);

        // Assign the layer object to variable
        O_layers = overlay.layer._layers;
        console.log(O_layers); // console.log it for tracking

        // Assign length of dataset to variable
        O_layers_count = Object.keys(O_layers).length;

        // Get the SVG Group as a d3 object
        var $svg_g = d3.select(".leaflet-overlay-pane svg g");

        // comparison variables for layer
        var city_current = "", city_previous = "";
        var x_cur = "", y_cur = "", x_prev = "", y_prev = "";
        var i_city = 0;

        //
        // *** Get the x/y coordinates for each city with layer overlays on the page:
        //     Use them to output the <text> numeric value inside the SVG  ***
        //
        // Loop through all layers to get the cities being represented
        //  *Note: The loop takes action on the iteration following the previous, so the tracking  
        //          variables named "*_previous/_prev" are used to assign classes / count values
        //
        for (var i = 0; i < O_layers_count+1; i++) {
            // *** Layer data operations - eliminate last iteration ***
            if (i < O_layers_count) {
                // Assign current layer object
                var cur_layer = O_layers[Object.keys(O_layers)[i]];
                //var cur_layer = O_layers[key];

                // Set current coordinate
                var x_cur = cur_layer._point.x;
                var y_cur = cur_layer._point.y;

                // Set current city
                city_current = cur_layer.feature.city;
            }

            // If this is the only city value, a new city value, or the last city value,
            //  get the respective layer counts for each city
            if  (   (i==1 && O_layers_count==1)    || 
                    (i >0 && (city_current != city_previous && i < O_layers_count)) ||
                    (i==O_layers_count)
                ) {
                // City- and Layer type-specific class (e.g., "Genres_SanAntonio")
                var city_class = layer_type + "_" + city_previous.replace(/\s/g, "");

                // Get number of layers for the previous city (or current city if only 1)
                var num_layers = i_city;

                // For "remove" events, either remove the text overlay, or decrement it
                if (action == "remove") { 
                    // If there are still checkboxes checked, perform subtraction logic.
                    //  Otherwise, clear the value out.
                    var num_selected = d3.selectAll(".leaflet-control-layers-group input")
                        .filter(function(d,i) { if (this.checked==true) return this; })
                        .nodes().length;
                        
                    // Subtract the number of layers corresponding to the unchecked on from the total
                    if (num_selected > 0) {
                        // Update the city layer counts for the "remove" event
                        num_layers = updateCityLayerCounts($svg_g, action, num_layers, city_class);
                    } else {
                        // Zero out the num_layers variable, so nothing gets appended below
                        num_layers = 0; 
                    }

                } else {
                    // Update the city layer counts for the "add" event
                    num_layers = updateCityLayerCounts($svg_g, action, num_layers, city_class);
                }

                // Remove the existing <text> elements for this city (we add the updated one below)
                $svg_g.selectAll("text." + city_class).remove();
                
                // Create a new <text> node inside the <svg> element, for the specified x/y coords
                // Superimpose the <text> number onto the <path> circle for previous city
                // (Only if we have non-zero layer count.)
                if (num_layers > 0) {
                    $svg_g.append("text")
                        .classed(city_class, true)
                        .attr("x", x_prev - 6)
                        .attr("y", y_prev + 18)
                        .style("font-size", "1.6em")
                        .text(num_layers);
                }

                // Reset city count
                i_city = 0;
            }

            // Assign this layer's city name & x/y coords to the old values for tracking
            city_previous = city_current;
            x_prev = x_cur;
            y_prev = y_cur;
            
            // Iterate city count
            i_city++;
        }
    }
}

/**
 * Based on type of action (add or remove), increase or decrease the count of layers (results)
 *  corresponding to the applicable cit(ies) 
 * @param {Object} $svg_g - SVG group object (d3)
 * @param {string} action - Type of event (add or remove)
 * @param {string} city_class - CSS class name for the layer type-city combo
 * @returns {number} - Number of layers
 */
function updateCityLayerCounts ($svg_g, action, num_layers, city_class) {
    // Get the SVG Group as a d3 object
    var $svg_g = d3.select(".leaflet-overlay-pane svg g");

    // If there is already a <text> element for this city/layer type combo, increment its value
    var $cityTextLayers = $svg_g.selectAll("text." + city_class);
    var cur_layer_count = 0, highest_layer_count = 0;

    // Check to see if any <text> elements exist.
    if (!$cityTextLayers.empty()) {
        // Loop through all instances of <text> elements and locate the one with the highest value.
        $cityTextLayers.each(function(d) {
            if (this.textContent !== "") {
                cur_layer_count = parseInt(this.textContent);
                // Keep track of the highest number of layers
                if (highest_layer_count < cur_layer_count)
                    highest_layer_count = cur_layer_count;
            }
        });
        
        if (action == "add") {
            // Increase the total number of layers by the highest layer count value
            num_layers = num_layers + highest_layer_count;
        } else {
            // Decrease the current layer count from the highest layer count (current total)
            num_layers = highest_layer_count - num_layers;
        }
    }

    // Return updated count
    return num_layers;
}

/**
 * From list of category-specific arrays, add layer options to map
 * @param {Object[]} data - JSON data
 * @param {string} type - Type of layer object
 * @returns {Object} - catOverlays object
 */
function createLayers(category_arrays, type) {
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
                switch(type) {
                    case "genre":
                        // Create and store new layer in overlays object
                        catOverlays[cat_name] = new L.GeoJSON(null, {
                            pointToLayer: bindOverlayLayer,
                            style: styleOverlayLayerGenre
                        });
                        break;
                    case "race":
                       // Create and store new layer in overlays object
                        catOverlays[cat_name] = new L.GeoJSON(null, {
                            pointToLayer: bindOverlayLayer,
                            style: styleOverlayLayerRace
                        });
                        break;
                    default:
                }
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
function styleOverlayLayerGenre(feature) {
    return {
        fillColor: "#ffa9a9",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };
}
/**
 * A Function defining the Path options for styling 
 * GeoJSON lines and polygons, called internally when data is added
 * @param {*} feature 
 */
function styleOverlayLayerRace(feature) {
    return {
        fillColor: "#43e16d",
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

  