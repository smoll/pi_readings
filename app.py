import sqlite3
from flask import Flask, g, request, jsonify
from flask_cors import CORS
from sense_hat import SenseHat
from sensehat_reset import flash

sense = SenseHat()
app = Flask(__name__)
CORS(app)

DATABASE = './database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.route("/")
def hello():
    temp = sense.get_temperature()
    return "Temperature: %s" % temp

@app.route('/temperature', methods=['GET', 'POST'])
def temperature():
    conn = get_db()
    c = conn.cursor()

    def persist_temperature_reading():
        query = """
        INSERT INTO readings(date, temperature, humidity, pressure) VALUES (?, ?, ?, ?);
        """
        c.execute(query, ['2018-06-20', sense.get_temperature(), sense.get_humidity(), sense.get_pressure()])
        conn.commit()
        flash()
        return "OK"

    def show_historical_temperatures():
        query = """
        SELECT * from readings ORDER BY id desc;
        """
        c.execute(query)
        return jsonify(readings=c.fetchall())

    if request.method == 'POST':
        return persist_temperature_reading()
    else:
        return show_historical_temperatures()

@app.teardown_appcontext
def close_connection(exception):

    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
