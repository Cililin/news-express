//导入请求工具
import request from '@/utils/request.js'

//提供调用注册接口的函数
export const userRegisterService = (registerData) => {
    //借助UrlSearchParams对象，将注册数据转换成URL格式
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key])
    }
    return request.post('/user/register', params)
}

//提供调用登录接口的函数
export const userLoginService = (loginData) => {
    //借助UrlSearchParams对象，将注册数据转换成URL格式
    const params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/user/login', params)
}

//获取用户详细信息
export const userInfoService = () => {
    return request.get('/user/userInfo')
}

//修改个人信息
export const updateUserInfoService = (userInfoData) => {
    return request.put('/user/update', userInfoData)
}

//修改头像
export const updateUserAvatarService = (avatarUrl) => {
    let params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl)
    return request.patch('/user/updateAvatar', params)
}

//更新密码
export const updatePasswordService = (userPwdData) => {
    return request.patch('/user/updatePwd', userPwdData)
}