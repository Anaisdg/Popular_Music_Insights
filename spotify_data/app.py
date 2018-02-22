import os
import DataCollection
import spotipy
import pprint
import spotipy.util as util
import pymongo
from flask import Flask, jsonify
from bson import json_util, ObjectId
import json
from spotify_config import client_id, client_secret, redirect_uri, scope, username

# Debugging variables
flask_debugging = True
debugging = False   # Set to true to only print results, don't insert into DB
limiting = True    # Set to true to limit the number of iterations against Spotify API
limit_cities = 2
limit_artists = 10
limit_tracks = 20

# Initialize Flask
app = Flask(__name__)

# Route that produces our JSON result
@app.route("/scrapeSpotify")
def scrapeSpotify():
    """ Call function to build cities array, and insert all retrieved city data as 
        MongoDB documents (in 'songs_db' database) 
    """
    # Store dictionary of scraped values from scraping function
    if debugging == True:
        cities = DataCollection.test()                                         # DEBUGGING ONLY
    else:
        cities = DataCollection.scrape_spotify_info(limiting, limit_cities)    # THE REAL THING

    #
    # Connect to MongoDB so we can store our 'city' documents as they are being built
    #
    mongodb_uri = os.environ.get("DATABASE_URI", "") or "mongodb://localhost:27017" 
    client = pymongo.MongoClient(mongodb_uri)
    db = client.songs_db  # Declare the DB

    # Loop through all cities in dataset
    i = 0
    for city in cities:
        # Exit out of for loop at 2 if we are limiting city loop iterations
        if limiting == True and i == limit_cities:
            break
        
        # Set Spotify authentication token 
        token = util.prompt_for_user_token(username, scope, client_id, client_secret, redirect_uri)
        if token:  # Authenticate with Spotify
            #
            # Begin Spotify analysis (e.g., determine popularity for each artist in city list, top track)
            #
            sp = spotipy.Spotify(auth=token)

            # Loop through the top artists for this city, and determine the popularity values
            i = 0
            top_artists = []

            for top_artist in city["top_artists"]:
                # Exit out of for loop at 2 if we are limiting city loop iterations
                if limiting == True and i == limit_artists:
                    break

                i += 1
                # *** Example artist value in dictionary ***
                #   {   'artist': 'Bobby Pulido',
                #        'tracks':   ['spotify:track:1tg7ZzCAkjDNENdWL7WuIr',
                #                    'spotify:track:2JJSGhPpATm8lXeYjD95fw',
                #                    'spotify:track:5iuGn3RXvfvHIyIe8fyxBE'
                #                    ],
                #       'popularity': 99       <------------- *** BEING ADDED ***
                #   }
                # Get info about the first artist track
                urn = top_artist["tracks"][0]
                track = sp.track(urn)

                # Get the artist's Spotify URI
                artist_uri = track['artists'][0]['uri']

                # Get the artist info
                artist_info = sp.artist(artist_uri)

                # Get the artist popularity and add it to the current 'top_artist' object
                artist_popularity = artist_info["popularity"]
                top_artist["popularity"] = artist_popularity

                # Build top_artist object and append updated object to master collection
                top_artists.append(top_artist)

            # Update the 'top_artists' field in the current city object
            top_artists.sort(key=lambda x: x["popularity"], reverse=True)
            city["top_artists"] = top_artists

            # Build 'top_5_artists' list: sort the 'top_artists' by popularity in descending order
            top_5_artists = []
            i_art = 0
            for art in top_artists:
                if i_art == 5:
                    break
                top_5_artists.append(art["artist"])
                i_art += 1
                
            # Update the 'top_5_artists' field in the current city object
            city["top_5_artists"] = top_5_artists

            # Loop through all tracks for this city, and create a new list of objects with the track popularity
            # BEFORE: [trk1, trk2, trk3, ...]
            # AFTER:  [
            #           {'track': trk1, 'popularity': pop1, 'name': 'El Baile de Gorila', 'artist': 'Mossino'}
            #           {'track': trk2, 'popularity': pop2}
            #           ...
            #          ]    
            i = 0
            tracks = []
            highest_popularity = 0
            most_popular_track = ""

            for trk in city["track_ids"]:
                # Exit out of for loop at 2 if we are limiting city loop iterations
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
                                "name:": current_track_name
                            }
            
                # Append updated object to track_ids array
                tracks.append(track_info)

                # Determine most popular track
                if highest_popularity < current_track_popularity:
                    most_popular_track = trk
                    highest_popularity = current_track_popularity
                    most_popular_artist = current_track_artist
                    most_popular_track_name = current_track_name
        
                print("most popular track: " + most_popular_track)
                print("highest popularity: " + str(highest_popularity))
                print("current track: " + trk )
                    
            # Update current city value with updated 'tracks' array info
            city["track_ids"] = tracks

            # Update current city's 'top_track' field with the most popular track info
            mostpopular_track_info = { 
                            "track": most_popular_track, 
                            "popularity": highest_popularity,
                            "artist": most_popular_artist,
                            "name:": most_popular_track_name
                        }
            city["top_track"] = mostpopular_track_info

            if debugging == True:
                # **** Print out resulting object (TESTING ONLY) ****
                pprint.pprint(city)
            else:
                # **** Insert the current city record into the MongoDB collection ****
                db.Cities.update(   { "city": city["city"] },  
                                    city,
                                    upsert=True
                                )
            
            # Iterate counter
            i += 1
    
    # Dump loaded MongoDB BSON to valid JSON string, and reload it as dictionary. Send jsonified results to browser
    cities_json = json.loads(json_util.dumps(cities))
    return jsonify(cities_json)

# Main script execution
if __name__ == "__main__":
    app.run(debug=flask_debugging)
