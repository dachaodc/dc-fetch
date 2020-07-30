'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDcFetchHoc = exports.default = undefined;

require('./promise-extends');

var _dcFetch = require('./dc-fetch');

var _dcFetch2 = _interopRequireDefault(_dcFetch);

var _reactHoc = require('./react-hoc');

var _reactHoc2 = _interopRequireDefault(_reactHoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _dcFetch2.default;
exports.createDcFetchHoc = _reactHoc2.default;