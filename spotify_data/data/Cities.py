# GEOJson Format:
# {
#    type: "FeatureCollection",
#    features: [
#        {
#           type: "Feature",
#           geometry: {
#                type: "Point",
#                coordinates: [lat, lng]
#           }
#         }
#    ]
#}

# Define the list of URLs for each city in our dataset
cities = [
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-98.5, 29.5, 0],
    },  
    "city": "San Antonio",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=San%20Antonio%20Texas%20US&scope=United%20States",
    "perc_latino": "62",
    "perc_black": "6.9",
    "perc_asian": "2.4",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-118.2437, 34.0522, 0],
    },  
    "city": "Los Angeles",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Los%20Angeles%20California%20US&scope=United%20States",
    "perc_latino": "47.5",
    "perc_black": "9.8",
    "perc_asian": "10.7",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []        
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-122.25, 37.47, 0],
    },  
    "city": "San Francisco",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=San%20Francisco%20California%20US&scope=United%20States",
    "perc_latino": "15.1",
    "perc_black": "6.1",
    "perc_asian": "48.1",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-87.6298, 41.8781, 0],
    },  
    "city": "Chicago",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Chicago%20Illinois%20US&scope=United%20States",
    "perc_latino": "28",
    "perc_black": "32",
    "perc_asian": "5",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-104.52, 39.45, 0],
    },          
    "city": "Denver",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Denver%20Colorado%20US&scope=United%20States",
    "perc_latino": "31.2",
    "perc_black": "11.1",
    "perc_asian": "4.5",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-73.57, 40.37, 0],
    },   
    "city": "Brooklyn",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Brooklyn%20New%20York%20US&scope=United%20States",
    "perc_latino": "19.8",
    "perc_black": "31.9",
    "perc_asian": "10.4",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-93.16, 44.59, 0],
    },  
    "city": "Minneapolis",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Minneapolis%20Minnesota%20US&scope=United%20States",
    "perc_latino": "10.5",
    "perc_black": "18.6",
    "perc_asian": "5.6",
    "top_artists": "",
    "top_5_artists": "",
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-80.12, 25.46, 0],
    }, 
    "city": "Miami",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Miami%20Florida%20US&scope=United%20States",
    "perc_latino": "70",
    "perc_black": "19.2",
    "perc_asian": "1",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-80.5, 35.13, 0],
    }, 
    "city": "Charlotte",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Charlotte%20North%20Carolina%20US&scope=United%20States",
    "perc_latino": "13.1",
    "perc_black": "35",
    "perc_asian": "5",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-77, 38.54, 0],
    }, 
    "city": "Washington, DC",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Washington%20District%20of%20Columbia%20US&scope=United%20States",
    "perc_latino": "10.9",
    "perc_black": "47.7",
    "perc_asian": "4.1",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-84.23, 33.45, 0],
    }, 
    "city": "Atlanta",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Atlanta%20Georgia%20US&scope=United%20States",
    "perc_latino": "4.7",
    "perc_black": "51.4",
    "perc_asian": "3.7",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-95.3698, 29.7604, 0],
    }, 
    "city": "Houston",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Houston%20Texas%20US&scope=United%20States",
    "perc_latino": "37",
    "perc_black": "25.3",
    "perc_asian": "5.3",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-116.12, 43.37, 0],
    }, 
    "city": "Boise", 
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Boise%20Idaho%20US&scope=United%20States",
    "perc_latino": "7.1",
    "perc_black": "1.5",
    "perc_asian": "0.2",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-112.04, 33.27, 0],
    }, 
    "city": "Phoenix",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Phoenix%20Arizona%20US&scope=United%20States",
    "perc_latino": "40.8",
    "perc_black": "6.5",
    "perc_asian": "3.2",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    },
    {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-71.03, 42.21, 0],
    }, 
    "city": "Boston",
    "spotify_url": "http://everynoise.com/everyplace.cgi?root=Boston%20Massachusetts%20US&scope=United%20States",
    "perc_latino": "22.1",
    "perc_black": "24.7",
    "perc_asian": "9.1",
    "top_artists": [],
    "top_5_artists": [],
    "top_track": {},
    "track_ids": []
    }
]
