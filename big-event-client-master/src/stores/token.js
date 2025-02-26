//定义store
import {
    defineStore
} from 'pinia'
import {
    ref
} from 'vue'

// 第一个参数：store，必须唯一
// 第二个参数：函数，函数内部可定义状态的所有内容
// 返回值：函数

export const useTokenStore = defineStore('token', () => {
    //定义状态内容
    //1.响应式变量
    const token = ref('')

    //2.定义一个函数，修改token的值
    const setToken = (newToken) => {
        token.value = newToken
    }

    //3.移除token的值的函数
    const removeToken = () => {
        token.value = ''
    }

    return {
        token,
        setToken,
        removeToken
    }
}, {
    persist: true //持久化存储
})