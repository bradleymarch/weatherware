module.exports = {
  PORT: process.env.PORT || 8080,
  OPEN_WEATHER_MAP_API_KEY: "98500b30bcf94df7d89fffc470786b49",
  DATABASE_URL: process.env.DATABASE_URL || global.DATABASE_URL || "mongodb://bmarch:bmarch@ds151951.mlab.com:51951/capstone2",
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || global.TEST_DATABASE_URL || "mongodb://bmarch:bmarch@ds143342.mlab.com:43342/capstone2test",
};