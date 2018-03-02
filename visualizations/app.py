import os
import pprint
from flask_pymongo import PyMongo
from flask import Flask, jsonify, request
from bson import json_util, ObjectId
import json

# Debugging variables
flask_debugging = False  # Set to True when in Flask debug mode (DISABLE BEFORE DEPLOYING LIVE)

# Initialize Flask
app = Flask(__name__)

# Route that outputs database results
@app.route("/getCitiesFromMongo")
def getCitiesFromMongo():
    """ Retrieve & return all cities from the MongoDB collection 
        Returns: jsonified results """
    db = connectToMongo()

    # If a limit was specified in the querystring, use it to limit our results
    if request.args.get('limit'):
        limit = int(request.args.get('limit'))        
        return getJSON(wrapGeoJSON(db.Cities.find().limit(limit)))
    else:
        return getJSON(wrapGeoJSON(db.Cities.find()))

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
    MONGODB_URI = os.environ.get('MONGODB_URI')
    if not MONGODB_URI:
        MONGODB_URI = "mongodb://localhost:27017/insights_db"

    app.config['MONGO_URI'] = MONGODB_URI
    mongo = PyMongo(app)

    return mongo.db  # Return the database instance from Mongo

#
# *** Main script execution ***
#
if __name__ == "__main__":
    app.run(debug=flask_debugging)
