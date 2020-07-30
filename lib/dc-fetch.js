'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 基于[axios]{@link https://github.com/mzabriskie/axios}进行封装的网络工具
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * // 引入
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * import DcFetch from 'path/to/dc-fetch';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * const dcFetch = new DcFetch({ // 这里传入的是自定义配置
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *    onShowErrorTip: (response, successTip) => true, // 如何全局处理错误
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *    onShowSuccessTip: (err, errorTip) => true, // 如何全局处理成功
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *    isMock: (url, data, method, options) => true, // 如何判断请求是否是mock
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * // axios默认配置通过如下方式进行配置：
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * dcFetch.defaults.timeout = 20000;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * dcFetch.mockDefaults.timeout = 20000;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * // 发起get请求
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * this.setState({loading: true}); // 开始显示loading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * const getDcFetch = dcFetch.get('/users', {pageNum: 1, pageSize: 10});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * getDcFetch.then((data, res) => console.log(data, res))
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * .catch(err => console.log(err))
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * .finally(() => { // 如果要使用finally方法，需要对promise对象进行扩展
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     this.setState({loading: false}); // 结束loading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * // 可以打断请求
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * // 注意：get，post等第一层返回的promise对象拥有cancel方法，以后then返回的promise对象没有cancel方法
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * getDcFetch.cancel();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * mockjs 使用单独的实例，可以与真实dcFetch请求实例区分开，
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 用于正常请求和mock同时使用时，好区分；
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 创建实例，通过isMock(url, data, method, options)函数，区分哪些请求需要mock，
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 比如：url以约定'/mock'开头的请求，使用mock等方式。
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * // 配合mock使用
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * import MockAdapter from 'axios-mock-adapter';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * import mockInstance from 'path/to/mockInstance';
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * const mock = new MockAdapter(mockInstance);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * mock.onGet('/success').reply(200, {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     msg: 'success',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module dc-tools 中 network工具
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      **/

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _qs = require('qs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DcFetch = function () {
    /**
     * 构造函数传入的是自定义的一些配置，
     * axios相关的全局配置使用dcFetch实例进行配置：
     * dcFetch.defaults.xxx dcFetch.mockDefaults.xxx进行配置
     *
     * @param onShowErrorTip 如何显示错误提示
     * @param onShowSuccessTip 如何显示成功提示
     * @param isMock 区分哪些请求需要mock，比如：url以约定'/mock'开头的请求，使用mock等方式。
     */
    function DcFetch() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$onShowSuccessTip = _ref.onShowSuccessTip,
            onShowSuccessTip = _ref$onShowSuccessTip === undefined ? function () {
            return (/* response, successTip  */true
            );
        } : _ref$onShowSuccessTip,
            _ref$onShowErrorTip = _ref.onShowErrorTip,
            onShowErrorTip = _ref$onShowErrorTip === undefined ? function () {
            return (/* err, errorTip */true
            );
        } : _ref$onShowErrorTip,
            _ref$isMock = _ref.isMock,
            isMock = _ref$isMock === undefined ? function () {
            return (/* url, data, method, options */false
            );
        } : _ref$isMock;

        _classCallCheck(this, DcFetch);

        this.singleGets = {};

        this.instance = _axios2.default.create();
        this.mockInstance = _axios2.default.create();
        this.setDefaultOption(this.instance);
        this.setDefaultOption(this.mockInstance);
        this.defaults = this.instance.defaults;
        this.mockDefaults = this.mockInstance.defaults;

        this.onShowSuccessTip = onShowSuccessTip;
        this.onShowErrorTip = onShowErrorTip;
        this.isMock = isMock;
    }

    _createClass(DcFetch, [{
        key: 'setDefaultOption',
        value: function setDefaultOption(instance) {
            instance.defaults.timeout = 10000;
            instance.defaults.headers.post['Content-Type'] = 'application/json';
            instance.defaults.headers.put['Content-Type'] = 'application/json';
            instance.defaults.baseURL = '/';
            instance.defaults.withCredentials = true; // 跨域携带cookie
        }

        /**
         *
         * @param url
         * @param data
         * @param method
         * @param options 配置数据，最常用是【successTip】属性，也可以把url data method options覆盖掉；
         * @returns {Promise}
         */

    }, {
        key: 'fetch',
        value: function fetch(url) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _this = this;

            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            // 有 null的情况
            data = data || {};
            options = options || {};

            var _options = options,
                _options$successTip = _options.successTip,
                successTip = _options$successTip === undefined ? false : _options$successTip,
                _options$errorTip = _options.errorTip,
                errorTip = _options$errorTip === undefined ? method === 'get' ? '获取数据失败！' : '操作失败！' : _options$errorTip;


            var CancelToken = _axios2.default.CancelToken;
            var cancel = void 0;

            var isGet = method === 'get';
            var isMock = this.isMock(url, data, method, options);

            var instance = this.instance;

            /**
             * 封装内不做处理，如果需要，通过如下方式，或者其他方法自行处理
             * axiosInstance.interceptors.request.use(cfg => {
             *   // Do something before request is sent
             *   return cfg;
             * }, error => {
             *   // Do something with request error
             *   return Promise.reject(error);
             * });
             *
             **/

            if (isMock) {
                instance = this.mockInstance;
            }

            /**
             *
             * Content-Type application/x-www-form-urlencoded 存在问题
             * 参见：https://github.com/axios/axios/issues/362
             *
             **/
            var defaultsContentType = instance.defaults.headers[method]['Content-Type'] || '';
            var contentType = options.headers && options.headers['Content-Type'] || '';
            if (defaultsContentType && defaultsContentType.indexOf('application/x-www-form-urlencoded') > -1 || contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                data = (0, _qs.stringify)(data);
            }

            var params = {};
            if (isGet) {
                params = data; // params 是get请求拼接到url上的
                data = {}; // data 是put、post 等请求发送的数据
            }

            var fetchPromise = new Promise(function (resolve, reject) {
                instance(_extends({
                    method: method,
                    url: url,
                    data: data,
                    params: params,
                    cancelToken: new CancelToken(function (c) {
                        return cancel = c;
                    })
                }, options)).then(function (response) {
                    _this.onShowSuccessTip(response, successTip);
                    resolve(response.data, response);
                }, function (err) {
                    var isCanceled = err && err.message && err.message.canceled;
                    if (isCanceled) return; // 如果是用户主动cancel，不做任何处理，不会触发任何函数
                    _this.onShowErrorTip(err, errorTip);
                    reject(err);
                }).catch(function (error) {
                    reject(error);
                });
            });
            fetchPromise.cancel = function () {
                cancel({
                    canceled: true
                });
            };
            return fetchPromise;
        }

        /**
         * 发送一个get请求，一般用于查询操作
         * @param {string} url 请求路径
         * @param {object} [params] 传输给后端的数据，正常请求会转换成query string 拼接到url后面
         * @param {object} [options] axios 配置参数
         * @returns {Promise}
         */

    }, {
        key: 'get',
        value: function get(url, params, options) {
            return this.fetch(url, params, 'get', options);
        }

        /**
         * 发送一个post请求，一般用于添加操作
         * @param {string} url 请求路径
         * @param {object} [data] 传输给后端的数据
         * @param {object} [options] axios 配置参数
         * @returns {Promise}
         */

    }, {
        key: 'post',
        value: function post(url, data, options) {
            return this.fetch(url, data, 'post', options);
        }

        /**
         * 发送一个put请求，一般用于更新操作
         * @param {string} url 请求路径
         * @param {object} [data] 传输给后端的数据
         * @param {object} [options] axios 配置参数
         * @returns {Promise}
         */

    }, {
        key: 'put',
        value: function put(url, data, options) {
            return this.fetch(url, data, 'put', options);
        }

        /**
         * 发送一个patch请求，一般用于更新部分数据
         * @param {string} url 请求路径
         * @param {object} [data] 传输给后端的数据
         * @param {object} [options] axios 配置参数
         * @returns {Promise}
         */

    }, {
        key: 'patch',
        value: function patch(url, data, options) {
            return this.fetch(url, data, 'patch', options);
        }

        /**
         * 发送一个delete请求，一般用于删除数据，params会被忽略（http协议中定义的）
         * @param {string} url 请求路径
         * @param {object} [data] 传输给后端的数据
         * @param {object} [options] axios 配置参数
         * @returns {Promise}
         */

    }, {
        key: 'del',
        value: function del(url, data, options) {
            return this.fetch(url, data, 'delete', options);
        }
    }, {
        key: 'singleGet',


        /**
         * 发送新的相同url的get请求，历史未结束相同url请求就会被打断，同一个url请求，最终只会触发一次
         * 用于输入框，根据输入远程获取提示等场景
         *
         * @param {string} url 请求路径
         * @param {object} [params] 传输给后端的数据
         * @param {object} [options] axios 配置参数
         * @returns {Promise}
         */
        value: function singleGet(url, params, options) {
            var oldFetch = this.singleGets[url];
            if (oldFetch) {
                oldFetch.cancel();
            }
            var singleFetch = this.fetch(url, params, 'get', options);
            this.singleGets[url] = singleFetch;
            return singleFetch;
        }
    }]);

    return DcFetch;
}();

exports.default = DcFetch;
module.exports = exports.default;