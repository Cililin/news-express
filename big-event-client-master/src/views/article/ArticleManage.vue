<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { nextTick, ref } from "vue";

//文章分类数据模型
const categorys = ref([
    {
        // "id": 3,
        // "categoryName": "美食",
        // "categoryAlias": "my",
        // "createTime": "2023-09-02 12:06:59",
        // "updateTime": "2023-09-02 12:06:59"
    },
]);

//用户搜索时选中的分类id
const categoryId = ref("");

//用户搜索时选中的发布状态
const state = ref("");

//文章列表数据模型
const articles = ref([
    {
        // "id": 5,
        // "title": "陕西旅游攻略",
        // "content": "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
        // "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        // "state": "草稿",
        // "categoryId": 2,
        // "createTime": "2023-09-03 11:55:30",
        // "updateTime": "2023-09-03 11:55:30"
    },
]);

//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(3); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    getArticleList();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    getArticleList();
};

//回显文章分类
import {
    getArticleCategoryListService,
    getArticleListService,
    addArticleService,
    updateArticleService,
    deleteArticleService,
} from "@/api/article";
const getArticleCategoryList = async () => {
    let result = await getArticleCategoryListService();
    categorys.value = result.data;
};
getArticleCategoryList();

//获取文章列表数据
const getArticleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null,
    };
    let result = await getArticleListService(params);

    //渲染视图
    total.value = result.data.total;
    articles.value = result.data.items;

    //处理数据 针对分类显示
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
};
getArticleList();

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Plus } from "@element-plus/icons-vue";
//控制抽屉是否显示
const drawerMode = ref("add");
const visibleDrawer = ref(false);
//添加表单数据模型
const articleModel = ref({
    title: "",
    categoryId: "",
    coverImg: "",
    content: "",
    state: "",
});

import { useTokenStore } from "@/stores/token";
const tokenStore = useTokenStore();
//上传成功的回调函数
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data;
    // console.log(result.data);
};

//定义弹窗标题数据模型
const title = ref("");
const articleEdit = (row) => {
    visibleDrawer.value = true;
    title.value = "编辑文章";
    //数据回显
    articleModel.value = {
        ...row,
        id: row.id,
    };
    drawerMode.value = "edit";
};
//添加文章
import { ElMessage } from "element-plus";
const addArticle = async (state) => {
    title.value = "添加文章";
    //把发布的状态赋值给数据模型
    articleModel.value.state = state;

    //调用接口
    // let result = await addArticleService(articleModel.value);
    // ElMessage.success(result.message ? result.message : '添加成功')
    // 检查 result 是否定义，并访问 msg 属性
    // console.log(result);

    // if (result && result.msg) {
    //     ElMessage.success(result.msg)
    // } else {
    //     ElMessage.success('添加成功');
    // }

    //调用接口
    let result;
    if (drawerMode.value == "add") {
        result = await addArticleService(articleModel.value);
    } else {
        result = await updateArticleService(articleModel.value);
    }
    //处理结果
    ElMessage.success(result.message ? result.message : "添加成功");

    //抽屉消失
    visibleDrawer.value = false;

    //刷新当前列表
    getArticleList();
};

//重置抽屉数据
const resetDrawerData = () => {
    drawerMode.value = "add";
    title.value = "添加文章";
    articleModel.value = {
        title: "",
        categoryId: "",
        coverImg: "",
        content: "",
        state: "",
    };
    nextTick(() => {
        // 清空 Quill 编辑器的内容
        const editor = document.querySelector(".ql-editor");
        if (editor) {
            editor.innerHTML = "";
        }
    });
};

//删除文章
import { ElMessageBox } from "element-plus";
const deleteArticle = (row) => {
    ElMessageBox.confirm("你确认删除该文章吗？", "温馨提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            //用户点击了确认
            //调用接口
            let result = await deleteArticleService(row.id);
            ElMessage({
                type: "success",
                message: "删除成功",
            });
            //刷新列表
            getArticleList();
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: "info",
                message: "取消删除",
            });
        });
};
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getArticleList">搜索</el-button>
                <el-button @click="
                    categoryId = '';
                state = '';
                ">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="articleEdit(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%" @close="resetDrawerData">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px">
                <el-form-item label="文章标题">
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                    <!--
                        auto-upload:是否自动上传
                        action:上传地址
                        on-success:上传成功回调
                        on-error:上传失败回调
                        headers:上传请求头
                        name:设置上传的文件字段名
                    -->

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ Authorization: tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>
