from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample weather data (replace with dynamic data retrieval)
weather_data = [
    {"location": "New York", "date": "2023-09-17", "temperature": 25.0, "humidity": 60.0},
    {"location": "New York", "date": "2023-09-18", "temperature": 26.0, "humidity": 65.0},
    # Add more weather data as needed
]

# Endpoint to get weather data for a specific location
@app.route('/weather/<location>', methods=['GET'])
def get_weather_by_location(location):
    result = [weather for weather in weather_data if weather['location'].lower() == location.lower()]
    return jsonify(result)

# Endpoint to get weather data for a specific date
@app.route('/weather/<location>/<date>', methods=['GET'])
def get_weather_by_location_and_date(location, date):
    result = [weather for weather in weather_data if weather['location'].lower() == location.lower() and weather['date'] == date]
    return jsonify(result)

# Endpoint to get weather data for a date range
@app.route('/weather/<location>/<start_date>/<end_date>', methods=['GET'])
def get_weather_by_location_and_date_range(location, start_date, end_date):
    result = [weather for weather in weather_data if
              weather['location'].lower() == location.lower() and start_date <= weather['date'] <= end_date]
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)


