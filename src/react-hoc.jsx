import React, {Component} from 'react';

/**
 * 将dcFetch属性注入到目标组件props中，目标组件可以通过this.props.dcFetch.get(...)方式进行使用;
 * 每次发送请求时，保存了请求的句柄，在componentWillUnmount方法中，进行统一cancel，进行资源释放，防止组件卸载之后，dcFetch回调还能执行引起的bug。
 * @example
 * const dcFetch = createDcFetchHoc(dcFetch)
 * // 装饰器方式：
 * // @dcFetch()
 * // class SomeComponent extends Component {...}
 *
 * // 传递参数，修改注入的props属性
 * // @dcFetch({propName = 'dcFetch1'})
 * // 组件内调用：this.props.dcFetch1
 * // class SomeComponent extends Component {...}
 *
 * @example
 * // 直接使用
 * const WrappedComponet = dcFetch()(SomeComponent);
 *
 */
const createDcFetchHoc = dcFetch => ({propName = 'dcFetch'} = {}) => WrappedComponent => {
    class WithSubscription extends Component {
        constructor(props) {
            super(props);
            this._$dcFetch = {};
            this._$dcFetchTokens = [];
            const methods = ['get', 'post', 'put', 'patch', 'del', 'singleGet'];

            for (let method of methods) {
                this._$dcFetch[method] = (...args) => {
                    const dcFetchToken = dcFetch[method](...args);
                    this._$dcFetchTokens.push(dcFetchToken);
                    return dcFetchToken;
                };
            }
        }

        componentWillUnmount() {
            this._$dcFetchTokens.forEach(item => item.cancel());
        }

        render() {
            const injectProps = {
                [propName]: this._$dcFetch,
            };
            return <WrappedComponent {...injectProps} {...this.props}/>;
        }
    }

    return WithSubscription;
};

export default createDcFetchHoc;
