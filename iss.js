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

module.exports = { fetchMyIP, fetchCoordsByIP };
