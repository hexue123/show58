import axios from 'axios'
const Http = {}
Http.install = function(Vue, options) {
    //添加基准url
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
        // 4. 添加实例方法
    Vue.prototype.$http = axios
}
export default Http