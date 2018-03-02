import os
import time
import DataCollection
import spotipy
import pprint
import spotipy.util as util
import pymongo
import requests
from flask import Flask, jsonify, request
from bson import json_util, ObjectId
import json
from spotify_config import clientid, clientsecret, redirecturi, scope, username

# Debugging variables
flask_debugging = True # Set to True when in Flask debug mode (DISABLE BEFORE DEPLOYING LIVE)
debugging = False     # Set to True to only print results (don't insert into MongoDB)
limiting = False     # Set to True to limit the number of iterations against Spotify API
limit_cities = 15    # 
limit_artists = 10  # *** ITERATION LIMITING THRESHOLDS: Only in effect when "LIMITING=True" ***
limit_tracks = 20   #

# Initialize Flask
app = Flask(__name__)

# Route that produces our JSON result and populates database
@app.route("/scrapeSpotify")
def scrapeSpotify():
    """ Call function to build cities array, and insert all retrieved city data as 
        MongoDB documents (in 'songs_db' database)

        Returns: jsonified results 
    """
    # Set Spotify authentication token 
    token = util.prompt_for_user_token(username, scope, clientid, clientsecret, redirecturi)
    
    if token:  # Authenticate with Spotify
        # Store dictionary of scraped values from scraping function
        if debugging == True:
            cities = DataCollection.test()                                        # DEBUGGING ONLY
            #cities = DataCollection.scrape_spotify_info(limiting, limit_cities)   
            #return jsonify(cities)
        else:
            cities = DataCollection.scrape_spotify_info(limiting, limit_cities)    # THE REAL THING

        # Loop through all cities in dataset
        i = 0
        for city in cities:
            # Exit out of for loop at 2 if we are limiting city loop iterations
            if limiting == True and i == limit_cities:
                break       
            #
            # Begin Spotify analysis (e.g., determine popularity for each artist in city list, top track)
            #
            sp = spotipy.Spotify(auth=token)

            # Loop through the top artists for this city, and determine the popularity values
            i = 0
            top_artists = []
            artist_names = []
            for top_artist in city["top_artists"]:
                # Exit out of for loop at appropriate threshold, if we are limiting artist iterations
                if limiting == True and i == limit_artists:
                    break

                i += 1
                # *** Example artist value in dictionary ***
                #   {   'artist': 'Bobby Pulido',
                #        'tracks':   ['spotify:track:1tg7ZzCAkjDNENdWL7WuIr',
                #                    'spotify:track:2JJSGhPpATm8lXeYjD95fw',
                #                    'spotify:track:5iuGn3RXvfvHIyIe8fyxBE'
                #                    ],
                #       'popularity': 99       <--------- *** BEING ADDED ***
                #   }
                # Get info about the first artist track
                urn = top_artist["tracks"][0]
                track = sp.track(urn)

                # Get the artist's Spotify URI & name
                artist_uri = track['artists'][0]['uri']
                artist_name = track['artists'][0]['name']

                # Set the artist name to the first artist attributed to the song
                top_artist["artist"] = artist_name

                # Get the artist popularity, and add it to their 'top_artist' item
                artist_info = sp.artist(artist_uri)
                artist_popularity = artist_info["popularity"]
                top_artist["popularity"] = artist_popularity

                # Get the artist genres, and add it to their 'top_artist' item
                artist_genres = artist_info["genres"]
                top_artist["genres"] = artist_genres

                # If not already added, append updated top_artist object to master collection
                if artist_name not in artist_names:
                    top_artists.append(top_artist)
                    
                # Track current artists in flat list to avoid duplicates
                artist_names.append(artist_name) 

            # Sort 'top_artists' by popularity in descending order, update the field in the city object
            top_artists.sort(key=lambda x: x["popularity"], reverse=True)
            city["top_artists"] = top_artists

            # Artist & song popularity logic:
            # Build 'top_5_artists' list: grab top 5 (by popularity) from 'top_artists' 
            top_10_artists = []
            i_art = 0
            for art in top_artists:
                if i_art < 10:
                    top_10_artists.append(art["artist"])
                    
                i_art += 1
                
            # Update 'top_5_artists' field in the city object
            city["top_5_artists"] = top_10_artists[:5]

            # Loop through all tracks for this city, and create a new list of objects with the track popularity
            #   BEFORE: [trk1, trk2, trk3, ...]
            #   AFTER:  [
            #           {'track': trk1, 'popularity': pop1, 'name': 'El Baile de Gorila', 'artist': 'Mossino'}
            #           {'track': trk2, 'popularity': pop2}
            #           ...
            #          ]    
            i = 0
            tracks = []
            highest_popularity = 0
            most_popular_track = ""
            for trk in city["track_ids"]:
                # Exit out of for loop at appropriate threshold, if we are limiting track iterations
                if limiting == True and i == limit_tracks:
                    break

                i += 1
                # Get Spotify track metadata    
                track = sp.track(trk)
        
                # Get the track name, artist, and popularity -- and add it to the object
                current_track_name = track['name']
                current_track_artist = track['artists'][0]['name']
                current_track_popularity = track['popularity']
                track_info = { 
                                "track": trk, 
                                "popularity": current_track_popularity,
                                "artist": current_track_artist,
                                "name": current_track_name
                            }
            
                # Append updated object to track_ids array
                tracks.append(track_info)

                # For the top 10 artists, determine the song with the highest popularity
                if current_track_artist in top_10_artists:
                    # Determine most popular track
                    if highest_popularity < current_track_popularity:
                        most_popular_track = trk
                        highest_popularity = current_track_popularity
                        most_popular_artist = current_track_artist
                        most_popular_track_name = current_track_name        
                
                #print("most popular track: " + most_popular_track)
                #print("highest popularity: " + str(highest_popularity))
                #print("current track: " + trk )
                    
            # Update current city value with updated 'tracks' array info
            city["track_ids"] = tracks

            # Update current city's 'top_track' field with the most popular track info
            mostpopular_track_info = { 
                            "track": most_popular_track, 
                            "popularity": highest_popularity,
                            "artist": most_popular_artist,
                            "name": most_popular_track_name
                        }
            city["top_track"] = mostpopular_track_info

            if debugging == True:
                # **** Print out resulting object (TESTING ONLY) ****
                pprint.pprint(city)
            else:
                # **** Insert the current city record into the MongoDB collection ****
                db = connectToMongo()
                db.Cities.update(   { "city": city["city"] },  
                                    city,
                                    upsert=True
                                )
            
            # Iterate counter
            i += 1
    else: 
        print("Connection to Spotify API failed - token invalid.")

    return getJSON(wrapGeoJSON(cities))

def wrapGeoJSON(cities):
    """ Wrap returned cities array into GeoJSON-friendly format

        Returns: Object
    """
    cities_geojson = {
        "type": "FeatureCollection",
        "features": cities
    }

    return cities_geojson

def getJSON(cities):
    """ JSON formatting of 'cities' array:
        - Dump MongoDB BSON (binary JSON) using 'json_util' package, to valid JSON string
        - Reload it as dictionary
        - Send jsonified results to browser 
        
        Returns: jsonified results
        
        Arguments: cities -- array of cities (Object[])
                 """
    cities_json = json.loads(json_util.dumps(cities))
    return jsonify(cities_json)

def connectToMongo():
    """ Connect to MongoDB so we can store our 'city' documents as they are being built

        Returns: db -- database connection object
    """
    mongodb_uri = os.environ.get("DATABASE_URI", "") or "mongodb://localhost:27017" 
    client = pymongo.MongoClient(mongodb_uri)
    return client.insights_db  # Declare the DB

#
# *** Main script execution ***
#
if __name__ == "__main__":
    app.run(debug=flask_debugging)
