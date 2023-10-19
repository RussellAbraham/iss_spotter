/**
 * Prints human-readable information about the next fly-overs of the International Space Station (ISS).
 *
 * @param {Array<{ risetime: number, duration: number }>} passTimes - Array of data objects defining the next fly-overs of the ISS.
 *   Each object should have a 'risetime' property representing the time of the pass (in seconds since Unix epoch) and a 'duration' property representing the duration of the pass (in seconds).
 *
 * @returns {undefined}
 *
 * @sideeffect
 * Console log messages to make the ISS pass data more human-readable.
 * Example output:
 * Next pass at Mon Jun 10 2019 20:11:44 GMT-0700 (Pacific Daylight Time) for 468 seconds!
 */
const printPassTimes = (passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

module.exports = { printPassTimes };
