import Data_collection
import spotipy
import pprint
import spotipy.util as util
import pymongo
from flask import Flask, jsonify
from bson import json_util, ObjectId
import json
from spotify_config import client_id, client_secret, redirect_uri, scope, username

# Debugging variable
debugging = False   # Set to true to only print results, don't insert into DB
limiting = True    # Set to true to limit the number of iterations against Spotify API
limit_at = 4

# Initialize Flask
app = Flask(__name__)

# Call scraped values function, and insert them into MongoDB document in 'mars_db' database
@app.route("/scrapeSpotify")
def scrapeSpotify():
    # Store dictionary of scraped values from scraping function
    if debugging == True:
        cities = Data_collection.test()                   # DEBUGGING ONLY
    else:
        cities = Data_collection.scrape_spotify_info(limiting)    # THE REAL THING

    #
    # Connect to MongoDB so we can store our 'city' documents as they are being built
    #
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)
    db = client.songs_db  # Declare the DB

    # Loop through all cities in dataset
    i = 0
    for city in cities:
        # Exit out of for loop at 2 if we are limiting city loop iterations
        if limiting == True and i == limit_at:
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
                if limiting == True and i == limit_at:
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
                #if i < 20:
                urn = top_artist["tracks"][0]
                print("track id working: " + urn)
                track = sp.track(urn)
                # pprint.pprint(track)

                # Get the artist's Spotify URI
                artist_uri = track['artists'][0]['uri']

                # Get the artist info
                artist_info = sp.artist(artist_uri)
                #pprint.pprint(artist_info)

                # Get the artist popularity and add it to the current 'top_artist' object
                artist_popularity = artist_info["popularity"]
                top_artist["popularity"] = artist_popularity

                # Build top_artist object and append updated object to master collection
                top_artists.append(top_artist)
                #print(top_artist)

            # Update the updated object in the master list
            city["top_artists"] = top_artists
            #pprint.pprint(test_city)

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
                if limiting == True and i == limit_at:
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
                #db.Cities.update(city, { "upsert": True })
                db.Cities.insert(city)
            
            # Iterate counter
            i += 1
    
    # Dump loaded MongoDB BSON to valid JSON string, and reload it as dictionary. Send jsonified results to browser
    cities_json = json.loads(json_util.dumps(cities))
    return jsonify(cities_json)

if __name__ == "__main__":
    app.run(debug=True)

# *** TO DO: Updating the Gender of each artist (replace '0' with whatever index we are updating ***
# db.Cities.update ({'city': 'San Antonio'}, { '$set': {"top_artists.0.gender" : 'Male'} })
# *** End Gender update code ***

# *** TO DO: Querying for cities that have *any* male/female artists in the 'top-artists' array ***
#  db.Cities.find( { 'top_artists.gender': { $eq: 'Male' }})
# *** End Gender query selector

# To update a specific city's "top_5_artists" or "top_track" values:
#new_list = ["joe", "frank"]
#db.Cities.update(
#    { "city": "San Antonio" }, 
#    { "$set": 
#        {  
#            "top_5_artists": new_list
#        }
#    } 
#)
