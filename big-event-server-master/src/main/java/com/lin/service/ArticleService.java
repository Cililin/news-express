package com.lin.service;

import com.lin.pojo.Article;
import com.lin.pojo.PageBean;

public interface ArticleService {
    //新增文章
    void add(Article article);

    //条件分页查询
    PageBean<Article> list(Integer pageNum, Integer pageSize, Integer categoryId, String state);

    Object detail(Integer id);

    void update(Article article);

    void delete(Integer id);
}
