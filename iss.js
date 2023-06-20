const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * @param {function} callback - Callback function (error, ipAddress)
 *   - error: An error object if any occurred (nullable)
 *   - ipAddress: The IP address as a string (null if error)
 */
const fetchMyIP = function(callback) {
  const apiUrl = 'https://api.ipify.org?format=json';

  request(apiUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      const ipAddress = data.ip;
      callback(null, ipAddress);
    } else {
      callback(error, null);
    }
  });
};

module.exports = { fetchMyIP };
