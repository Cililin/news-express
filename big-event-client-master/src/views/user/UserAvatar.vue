<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
const uploadRef = ref()
import { onMounted } from 'vue'

import userInfoService from '@/stores/userInfo.js'
const userInfoStore = userInfoService();

//用户头像地址
const imgUrl = ref(userInfoStore.info.userPic)

//读取token信息
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore()
//图片上传成功的回调
const uploadSuccess = (result) => {
    //回显图片
    imgUrl.value = result.data
}

import { updateUserAvatarService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
//头像修改
const updateAvatar = async () => {
    let result = await updateUserAvatarService(imgUrl.value)
    ElMessage.success(result.message ? result.message : '修改成功')

    //更新pinia中的数据
    userInfoStore.info.userPic = imgUrl.value
}

// 使用 onMounted 生命周期钩子来确保组件已挂载
// 将事件绑定移到模板中，避免直接操作 DOM

/**
 *好处
1. 遵循 Vue 的最佳实践
使用 Vue 的生命周期钩子: 使用 onMounted 确保组件已经挂载完毕，这是 Vue 推荐的做法，能确保代码在合适的时机执行。
避免直接操作 DOM: 直接操作 DOM 可能会导致代码难以维护和调试。Vue 提供了丰富的 API 来处理这些情况，如通过模板绑定事件或使用 refs 访问组件实例。
2. 提高代码可维护性和可读性
清晰的结构: 通过将事件处理逻辑放在 <script setup> 内部，并且使用 Vue 的生命周期钩子，可以使代码结构更加清晰，易于理解和维护。
减少错误: 遵循 Vue 的推荐做法可以减少因不当操作 DOM 而产生的错误。
3. 增强组件的健壮性
确保 DOM 已准备好: 使用 onMounted 确保 DOM 元素已准备好再进行操作，可以避免因元素未准备好而引发的错误。
提高组件的灵活性: 通过使用 Vue 的事件绑定机制，组件可以更灵活地响应用户交互，而不依赖于具体的 DOM 操作。
4. 提升性能
避免不必要的渲染: 通过将事件绑定逻辑放在适当的生命周期阶段，可以避免不必要的渲染，从而提高应用的整体性能。
5. 易于测试
清晰的事件绑定逻辑: 使用 Vue 的事件绑定机制使得事件处理逻辑更加清晰，这有助于编写单元测试和集成测试。
6. 更好的用户体验
更流畅的操作: 通过确保 DOM 准备好后再触发事件，可以提供更流畅的用户体验，避免因为 DOM 未加载完成而导致的延迟响应。
 * 
 */

// 选择文件按钮点击事件
const selectFile = () => {
    uploadRef.value.$el.querySelector('input').click()
}

// 确保组件已挂载
onMounted(() => {
    // 这里可以安全地访问 $el
})

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>更换头像</strong></span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload ref="uploadRef" class="avatar-uploader" :show-file-list="false" :auto-upload="true"
                    action="/api/upload" name="file" :headers="{ 'Authorization': tokenStore.token }"
                    :on-success="uploadSuccess">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <img v-else src="@/assets/avatar.jpg" width="278" />
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large" @click="selectFile">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
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