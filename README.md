# 新闻速递项目-前端

## 一、技术栈

1. Vue3
2. Vite
3. Router
4. Pina
5. Element-Plus



## 二、跨域问题

### 1.跨域

浏览器同源策略限制，向不同源发送ajax请求失败

### 2.配置代理

```js
//utils.request.js
//定制请求的实例
//导入axios  npm install axios
import axios from 'axios';
//定义一个变量,记录公共的前缀  ,  baseURL
//该处将baseURL设置为/api
const baseURL = '/api';
const instance = axios.create({baseURL})

//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        alert('服务异常');
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)
export default instance;
```

```js
//vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //在该处进行配置
  server:{
    proxy:{
      '/api':{ //获取路径中包含/api的请求
        target:'http://localhost:9090', //后台服务所在的源
        changeOrigin:true, //修改源
        rewrite:path=>path.replace(/^\/api/,'') //将api替换成空字符串
      }
    }
  }
})
```

## 三、前端接口编写与调用

#### 1.用户接口

```js
//src.api.user.js
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
```

#### 2.文章接口

```js
//src.api.article.js
import request from '@/utils/request.js'

//文章分类列表查询
export const getArticleCategoryListService = () => {
    return request.get('/category')
}

//文章分类添加
export const addArticleCategoryService = (categoryData) => {
    return request.post('/category', categoryData)
}

//文章分类更新
export const updateArticleCategoryService = (categoryData) => {
    return request.put('/category', categoryData)
}

//文章分类删除
export const deleteArticleCategoryService = (id) => {
    return request.delete('/category?id=' + id)
}

//文章列表查询
export const getArticleListService = (params) => {
    return request.get('/article', {
        params: params
    })
}

//文章添加
export const addArticleService = (articleData) => {
    return request.post('/article', articleData)
}

//文章更新
export const updateArticleService = (articleData) => {
    return request.put('/article', articleData)
}

//文章分类删除
export const deleteArticleService = (id) => {
    return request.delete('/article?id=' + id)
}
```

#### 3.接口调用

```js
//以注册为例
//view.Login.vue
import { registerService} from '@/api/user.js'
//用于注册的事件函数
const register = async () => {
    //console.log('注册...');
    let result = await registerService(registerData.value);
    if (result.code == 0) {
        alert('注册成功!')
    } else {
        alert('注册失败!')
    }
}
```

## 四、优化axios响应截器

在接口调用的API中，我们都需要对业务响应的状态进行判断，从而给用户对应的提示，这个工作不难，但是每个接口的调用，都这样写代码，显然是比较繁琐的，我们可以在axios的相应拦截器中，如果服务器响应成功了，统一判断后台返回的业务状态码code，如果成功了，正常返回数据，如果失败了，则给出用户对应的提示即可

#### 1.**请求工具request.js**

```js
//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //如果业务状态码为0，代表本次操作成功
        if (result.data.code == 0) {
            return result.data;
        }
        //代码走到这里，代表业务状态码不是0，本次操作失败
        alert(result.data.message || '服务异常');
        return Promise.reject(result.data);//异步的状态转化成失败的状态
    },
    err => {
        alert('服务异常');
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)
```

#### 2.**接口调用user.js**

```js
//用于注册的事件函数
const register = async () => {
    //console.log('注册...');
    await registerService(registerData.value);
    alert('注册成功!')

}

//用于登录的事件函数
const login = async () => {
    await loginService(registerData.value)
    alert('登录成功!')
    
}
```

#### 3.**Element-Plus提示框的使用**

```js
import { ElMessage } from 'element-plus'

ElMessage.error('服务异常');
ElMessage.success('登录成功!')
```

## 五、配置子路由

#### 1.在src/router/index.js中配置子路由

```js
//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        component: LayoutVue,
        //重定向
        redirect: '/article/manage',
        //子路由
        children: [
            { path: '/article/category', component: ArticleCategoryVue },
            { path: '/article/manage', component: ArticleManageVue },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVUe },
            { path: '/user/password', component: UserResetPasswordVue },
        ]
    }
]
```

#### 2. 在Layout.vue组件的右侧中间区域，添加router-view标签

```html
<!-- 中间区域 -->
<el-main>
    <div style="width: 1290px; height: 570px;border: 1px solid red;">
        <router-view></router-view>
    </div>
</el-main>
```

#### 3. 菜单项设置点击后跳转的路由路径

el-menu-item 标签的index属性可以设置点击后的路由路径

```html
<el-menu-item index="/article/category">
    <el-icon>
        <Management />
    </el-icon>
    <span>文章分类</span>
</el-menu-item>
```

## 六、Pinia状态管理

Pinia是Vue的专属状态管理库，它允许你跨组件或页面共享状态

#### 1.安装

```js
npm install pinia
```

#### 2.使用Pinia

在main.js中，引入pinia，创建pinia实例，并调用vue应用实例的use方法使用pinia

```js
import { createPinia } from 'pinia'

const pinia = createPinia()
app.use(pinia)
```

#### 3.定义Store

在src/stores目录下定义token.js

```js
import { defineStore } from "pinia";
import {ref} from 'vue';

/*
    defineStore参数描述：
        第一个参数：给状态起名，具有唯一性
        第二个参数：函数，可以把定义该状态中拥有的内容

    defineStore返回值描述：
        返回的是一个函数，将来可以调用该函数，得到第二个参数中返回的内容
*/
export const useTokenStore = defineStore('token',()=>{
    //1.定义描述token
    const token = ref('')

    //2.定义修改token的方法
    const setToken = (newToken)=>{
        token.value = newToken
    }

    //3.定义移除token的方法
    const removeToken = ()=>{
        token.value=''
    }
    return {
        token,setToken,removeToken
    }
})
```

#### 4. 使用Store

在需要使用状态的地方，导入@/stores/*.js , 使用即可

在Login.vue中导入@/stores/token.js, 并且当用户登录成功后，将token保存pinia中

```js
//导入token状态
import { useTokenStore } from '@/stores/token.js'

//调用useTokenStore得到状态
const tokenStore = useTokenStore();

//用于登录的事件函数
const login = async () => {
    let result = await loginService(registerData.value)
    //保存token
    tokenStore.setToken(result.data)
    
    ElMessage.success('登录成功!')
    router.push('/')
}
```

在article.js中导入@/stores/token.js, 从pinia中获取到存储的token，在发起查询文章分类列表的时候把token通过请求头的形式携带给服务器

```js
//导入@/stores/token.js
import { useTokenStore } from '../stores/token'


//文章分类列表查询
export const articleCategoryListService = () => {
    //获取token状态
    const tokenStore = useTokenStore()
    //通过请求头Authorization携带token
    return request.get('/category', { headers: { 'Authorization': tokenStore.token } })
}
```

## 七、Pinia持久化插件

默认情况下，由于pinia是内存存储，当你刷新页面的时候pinia中的数据会丢失，可以借助于persist插件解决这个问题，persist插件支持将pinia中的数据持久化到sessionStorage和localStorage中

#### 1.安装persist插件

```js
npm install pinia-persistedstate-plugin
```

#### 2. pinia中使用persist插件

在main.js中

```js
import { createPinia } from 'pinia'
//导入持久化插件
import {createPersistedState} from'pinia-persistedstate-plugin'
const pinia = createPinia()
const persist = createPersistedState()
//pinia使用持久化插件
pinia.use(persist)
app.use(pinia)
```

#### 3. 在创建定义状态是配置持久化

在src/stores/token.js中

```js
export const useTokenStore = defineStore('token',()=>{
    //1.定义描述token
    const token = ref('')

    //2.定义修改token的方法
    const setToken = (newToken)=>{
        token.value = newToken
    }

    //3.定义移除token的方法
    const removeToken = ()=>{
        token.value=''
    }
    return {
        token,setToken,removeToken
    }
}
,
//参数持久化
{
    persist:true
}
)
```

## 八、axios请求拦截器

当进入主页后，将来要与后台交互，都需要携带token，如果每次请求都写这样的代码，将会比较繁琐，此时可以将携带token的代码通过请求拦截器统一处理

在 src/util/request.js中

```js
//导入token状态
import { useTokenStore } from '@/stores/token.js';
//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //在发送请求之前做什么
        let tokenStore = useTokenStore()
        //如果token中有值，在携带
        if(tokenStore.token){
            config.headers.Authorization=tokenStore.token
        }
        return config
    },
    (err)=>{
        //如果请求错误做什么
        Promise.reject(err)
    }
)
```

## 九、未登录统一处理

在后续访问接口时，如果没有登录，则前端不携带token，后台服务器会返回响应状态码401，代表未登录，此时可以在axios的响应拦截器中，统一对未登录的情况做处理

**request.js**

```js
import router from '@/router'


//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //如果业务状态码为0，代表本次操作成功
        if (result.data.code == 0) {
            return result.data;
        }
        //代码走到这里，代表业务状态码不是0，本次操作失败
        ElMessage.error(result.data.message || '服务异常');
        return Promise.reject(result.data);//异步的状态转化成失败的状态
    },
    err => {
        //如果响应状态码时401，代表未登录，给出对应的提示，并跳转到登录页
        if(err.response.status===401){
            ElMessage.error('请先登录！')
            router.push('/login')
        }else{
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)
```

## 十、el-dropdown中功能实现

在el-dropdown中有四个子条目，分别是：

- 基本资料
- 更换头像
- 重置密码
- 退出登录

其中其三个起到路由功能，跟左侧菜单中【个人中心】下面的二级菜单是同样的功能，退出登录需要删除本地pinia中存储的token以及userInfo

#### 1.**路由实现：**

在el-dropdown-item标签上添加command属性，属性值和路由表中/user/xxx保持一致

```html
<el-dropdown-menu>
    <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
    <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
    <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
    <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
</el-dropdown-menu>
```

在el-dropdown标签上绑定command事件,当有条目被点击后，会触发这个事件

```html
<el-dropdown placement="bottom-end" @command="handleCommand">
```

提供handleCommand函数，参数为点击条目的command属性值

```js
//dropDown条目被点击后，回调的函数
import {useRouter} from 'vue-router'
const router = useRouter()
const handleCommand = (command)=>{
    if(command==='logout'){
        //退出登录
        alert('退出登录')
    }else{
        //路由
        router.push('/user/'+command)
    }
}
```

#### 2.**退出登录实现：**

```js
import {ElMessage,ElMessageBox} from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore()
const handleCommand = (command) => {
    if (command === 'logout') {
        //退出登录
        ElMessageBox.confirm(
            '你确认退出登录码？',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                //用户点击了确认
                //清空pinia中的token和个人信息
                userInfoStore.info={}
                tokenStore.token=''
                //跳转到登录页
                router.push('/login')
            })
            .catch(() => {
                //用户点击了取消
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    } else {
        //路由
        router.push('/user/' + command)
    }
}
```

## 十一、修改头像

#### 1. 修改头像页面组件

```html
<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import {ref} from 'vue'
import avatar from '@/assets/default.png'
const uploadRef = ref()

//用户头像地址
const imgUrl= avatar

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload 
                    ref="uploadRef"
                    class="avatar-uploader" 
                    :show-file-list="false"
                    >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <img v-else src="avatar" width="278" />
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large"  @click="uploadRef.$el.querySelector('input').click()">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>
```

#### 2. 头像回显

从pinia中读取用户的头像数据

```js
//读取用户信息
import {ref} from 'vue'
import {useUserInfoStore} from '@/stores/user.js'
const userInfoStore = useUserInfoStore()
const imgUrl=ref(userInfoStore.info.userPic)
```

img标签上绑定图片地址

```html
<img v-if="imgUrl" :src="imgUrl" class="avatar" />
<img v-else src="@/assets/avatar.jpg" width="278" />
```

#### 3.头像上传

为el-upload指定属性值，分别有：

- ​	action: 服务器接口路径
- ​	headers: 设置请求头，需要携带token
- ​	on-success: 上传成功的回调函数
- ​	name: 上传图片的字段名称



```html
<el-upload 
           class="avatar-uploader" 
           :show-file-list="false"
           :auto-upload="true"
           action="/api/upload"
           name="file"
           :headers="{'Authorization':tokenStore.token}"
           :on-success="uploadSuccess"
           >
    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
    <img v-else src="@/assets/avatar.jpg" width="278" />
</el-upload>
```

提供上传成功的回调函数

```js
//读取token信息
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore()

//图片上传成功的回调
const uploadSuccess = (result)=>{
    //回显图片
    imgUrl.value = result.data
}
```

外部触发图片选择

​	需要获取到el-upload组件，然后再通过$el.querySelector('input')获取到el-upload对应的元素，触发click事件

```vue
//获取el-upload元素
const uploadRef = ref()


<el-button type="primary" :icon="Plus" size="large"  @click="uploadRef.$el.querySelector('input').click()">
    选择图片
</el-button>
```

#### 4.接口调用

在user.js中提供修改头像的函数

```js
//修改头像
export const userAvatarUpdateService=(avatarUrl)=>{
    let params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl)
    return request.patch('/user/updateAvatar',params)
}
```

为【上传头像】按钮绑定单击事件

```html
<el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
    上传头像
</el-button>
```

提供updateAvatar函数，完成头像更新

```js
//调用接口，更新头像url
import {userAvatarUpdateService} from '@/api/user.js'
import {ElMessage} from 'element-plus'
const updateAvatar = async ()=>{
    let result = await userAvatarUpdateService(imgUrl.value)
    ElMessage.success(result.message? result.message:'修改成功')
    //更新pinia中的数据
    userInfoStore.info.userPic=imgUrl.value
}
```

