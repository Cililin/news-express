<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
const categorys = ref([
    {
        // "id": 3,
        // "categoryName": "美食",
        // "categoryAlias": "my",
        // "createTime": "2023-09-02 12:06:59",
        // "updateTime": "2023-09-02 12:06:59"
    },
]);

//声明一个获取文章列表的异步函数
import {
    getArticleCategoryListService,
    addArticleCategoryService,
    updateArticleCategoryService,
    deleteArticleCategoryService,
} from "@/api/article.js";
const getArticleCategoryList = async () => {
    let result = await getArticleCategoryListService();
    categorys.value = result.data;
};
getArticleCategoryList();

//控制添加分类弹窗
const dialogVisible = ref(false);

//添加分类数据模型
const categoryModel = ref({
    categoryName: "",
    categoryAlias: "",
});
//添加分类表单校验
const rules = {
    categoryName: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
    categoryAlias: [{ required: true, message: "请输入分类别名", trigger: "blur" }],
};

//调用接口，添加表单
import { ElMessage } from "element-plus";
const addCategory = async () => {
    // 调用接口
    let result = await addArticleCategoryService(categoryModel.value);
    ElMessage.success(result.msg ? result.msg : "添加成功");

    //调用获取所有文章分类的函数
    getArticleCategoryList();
    dialogVisible.value = false; //关闭弹框
};

//定义弹窗标题数据模型
const title = ref("");

const articleCategoryEdit = (row) => {
    dialogVisible.value = true;
    title.value = "编辑分类";
    //数据回显
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    //拓展id属性，将来需要传递给后台完成分类的修改
    categoryModel.value.id = row.id;
};

//编辑分类
const updateCategory = async () => {
    //调用接口
    let result = await updateArticleCategoryService(categoryModel.value);

    ElMessage.success(result.msg ? result.msg : "修改成功");

    //调用获取所有分类的函数
    getArticleCategoryList();

    //隐藏弹窗
    dialogVisible.value = false;
};

// 清空模型的数据
const clearCategoryModel = () => {
    categoryModel.value.categoryName = "";
    categoryModel.value.categoryAlias = "";
};

//删除分类
import { ElMessageBox } from "element-plus";
const deleteCategory = (row) => {
    ElMessageBox.confirm("你确认删除该分类信息吗？", "温馨提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(async () => {
            //用户点击了确认
            //调用接口
            let result = await deleteArticleCategoryService(row.id);
            ElMessage({
                type: "success",
                message: "删除成功",
            });
            //刷新列表
            getArticleCategoryList();
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
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click="
                        dialogVisible = true;
                    title = '添加分类';
                    clearCategoryModel();
                    ">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="articleCategoryEdit(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加分类' ? addCategory() : updateCategory()">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
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
</style>
