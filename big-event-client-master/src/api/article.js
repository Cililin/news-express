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