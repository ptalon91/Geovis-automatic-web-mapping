'''
App to fetch data from PostGIS database make operations, create geoJSON and return it for usage in Javascript.
'''

# -*- coding: utf-8 -*-
import flask
import psycopg2 as db
import json

app = flask.Flask(__name__)
app.debug = True

# Connect to PostGIS database
conn = db.connect("dbname='geovis2' user='postgres' host='localhost' password='geovis2'")

@app.route('/')
def index():
    return flask.send_from_directory('static', 'index.html')

# Execute SQL uqery in PostGIS database
@app.route('/data/shapes')
def secteurs(epsg=4326):
    # get a query cursor
    cur = conn.cursor()
    # our SQL query:
    sql = """SELECT numsecteur AS fid, nom_sect AS secteur, 
                ST_AsGeoJson(ST_Transform(geom, %i), 7) AS geom, 
                ROUND(ST_AREA(geom) / 10000) AS superficie,
				sumb13btot / ROUND(ST_AREA(geom) / 10000) AS dens_pop,
				100*(cat1 / pcount) AS pcat1,
				100*(cat2 / pcount) AS pcat2,
				100*(cat3 / pcount) AS pcat3,
				100*(cat4 / pcount) AS pcat4,
				100*(cat5 / pcount) AS pcat5,
				100*(cat6 / pcount) AS pcat6,
				100*(cat7 / pcount) AS pcat7,
				100*(cat8 / pcount) AS pcat8,
				100*(cat9 / pcount) AS pcat9,
				100*(cat10 / pcount) AS pcat10,
				100*(cat11 / pcount) AS pcat11,
				100*(cat12 / pcount) AS pcat12,
				100*(cat13 / pcount) AS pcat13,
				100*(cat14 / pcount) AS pcat14,
				100*(cat15 / pcount) AS pcat15,
				100*(cat16 / pcount) AS pcat16,
				100*(cat17 / pcount) AS pcat17,
				cat1 AS cat1,
				cat2 AS cat2,
				cat3 AS cat3,
				cat4 AS cat4,
				cat5 AS cat5,
				cat6 AS cat6,
				cat7 AS cat7,
				cat8 AS cat8,
				cat9 AS cat9,
				cat10 AS cat10,
				cat11 AS cat11,
				cat12 AS cat12,
				cat13 AS cat13,
				cat14 AS cat14,
				cat15 AS cat15,
				cat16 AS cat16,
				cat17 AS cat17				
             FROM laus_sect;""" % epsg
    cur.execute(sql)
	
    # retrieve the query result
    rows = cur.fetchall()

    # build the features array with GeoJSON structure
    features = []
    for row in rows:
        features.append({ 
            "type": "Feature", 
            "properties": { 
                "geocode": row[0], 
                "nom": row[1],
                "superficie": row[3],
				"dens_pop": row[4],
				"pcat1": row[5],
				"pcat2": row[6],
				"pcat3": row[7],
				"pcat4": row[8],
				"pcat5": row[9],
				"pcat6": row[10],
				"pcat7": row[11],
				"pcat8": row[12],
				"pcat9": row[13],
				"pcat10": row[14],
				"pcat11": row[15],
				"pcat12": row[16],
				"pcat13": row[17],
				"pcat14": row[18],
				"pcat15": row[19],
				"pcat16": row[20],
				"pcat17": row[21],
				"cat1": row[22],
				"cat2": row[23],
				"cat3": row[24],
				"cat4": row[25],
				"cat5": row[26],
				"cat6": row[27],
				"cat7": row[28],
				"cat8": row[29],
				"cat9": row[30],
				"cat10": row[31],
				"cat11": row[32],
				"cat12": row[33],
				"cat13": row[34],
				"cat14": row[35],
				"cat15": row[36],
				"cat16": row[37],
				"cat17": row[38],
            },
            "geometry": json.loads(row[2])
        })
    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }
	
    return flask.jsonify(feature_collection)

@app.route('/data/shapes/<int:epsg>')
def secteurs_epsg(epsg):
    return secteurs(epsg)

if __name__ == '__main__':
	""""""
	app.run(host='0.0.0.0')
