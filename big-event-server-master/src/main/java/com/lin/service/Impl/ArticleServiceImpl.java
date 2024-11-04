package com.lin.service.Impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.lin.mapper.ArticleMapper;
import com.lin.pojo.Article;
import com.lin.pojo.PageBean;
import com.lin.service.ArticleService;
import com.lin.utils.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public void add(Article article) {
        //补充属性值
        article.setCreateTime(LocalDateTime.now());
        article.setUpdateTime(LocalDateTime.now());

        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        article.setCreateUser(userId);

        articleMapper.addArticle(article);
    }

    @Override
    public PageBean<Article> list(Integer pageNum, Integer pageSize, Integer categoryId, String state) {
        //1.创建PageBean对象
        PageBean<Article> pb = new PageBean<>();

        //2.开启分页查询PageHelper
        PageHelper.startPage(pageNum, pageSize);

        //3.调用mapper
        Map<String, Object> map = ThreadLocalUtil.get();
        Integer userId = (Integer) map.get("id");
        List<Article> as = articleMapper.list(userId, categoryId, state);
        //Page中提供了getTotal()方法，获取总记录数和当前页
        Page<Article> p = (Page<Article>) as;
        //封装PageBean对象
        pb.setTotal(p.getTotal());
        pb.setItems(p.getResult());
        return pb;
    }

    @Override
    public Object detail(Integer id) {
        return articleMapper.detail(id);
    }

    @Override
    public void update(Article article) {
        //补充属性值
        article.setCreateTime(LocalDateTime.now());
        article.setUpdateTime(LocalDateTime.now());

        Map<String, Object> map = ThreadLocalUtil.get();
        Integer id = (Integer) map.get("id");
        article.setCreateUser(id);

        articleMapper.update(article);
    }

    @Override
    public void delete(Integer id) {
        articleMapper.delete(id);
    }


}
