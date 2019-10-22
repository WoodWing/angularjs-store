if (process.env.NODE_ENV === 'production') {
  module.exports = require('./angularjs-store.min.js');
} else {
  module.exports = require('./angularjs-store.js');
}
