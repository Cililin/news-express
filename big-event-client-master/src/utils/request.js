//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';

import {
    ElMessage
} from 'element-plus'

//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/api';
const instance = axios.create({
    baseURL
})

import {
    useTokenStore
} from '@/stores/token';
//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore();
        //判断有无token
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    (error) => {
        //请求失败的回调
        return Promise.reject(error);
    }
)


import router from '@/router';
//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code === 0) {
            return result.data;
        }
        //操作失败
        // alert(result.data.msg ? result.data.msg : '服务异常');
        ElMessage.error(result.data.msg ? result.data.msg : '服务异常');
    },
    err => {
        //判断响应状态码，401则未登录，提示登录并跳转登录界面
        if (err.response.status === 401) {
            ElMessage.error('请先登录');
            return router.push('/login');
        } else {
            ElMessage.error('服务异常');
        }
        return Promise.reject(err); //异步的状态转化成失败的状态
    }
)

export default instance;