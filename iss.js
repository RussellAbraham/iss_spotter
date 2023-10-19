const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * @param {function} callback - A callback function to pass back an error or the IP string.
 *                            It has the signature (error: Error | null, ip: string | null) => void.
 * @returns {void}
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(
        Error(`Unexpected status code: ${response.statusCode}`),
        null
      );
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

/**
 * Makes a single API request to retrieve the latitude and longitude for a given IP address.
 * @param {string} ip - The IP address for which to fetch the coordinates.
 * @param {function} callback - A callback function to pass back an error or the coordinates object.
 *                            It has the signature (error: Error | null, coords: {latitude: number, longitude: number} | null) => void.
 * @returns {void}
 */
const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    } 

    const { latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude});
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  request(` https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error);
    }
    if (response.statusCode !== 200) {
      callback(
        Error(`Unexpected status code: ${response.statusCode}`),
        null
      );
      return;
    }    
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) { 
      return callback(error, null)
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) { 
        return callback(error, null)
      }
      fetchISSFlyOverTimes(coords, (error, passes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, passes);
      });
    });
  });
}


module.exports = { nextISSTimesForMyLocation };
