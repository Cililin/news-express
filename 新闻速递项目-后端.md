# 新闻速递项目-后端

## 一、技术栈

| 序号 | 技术栈      |
| :--: | :---------- |
|  1   | SpringBoot3 |
|  2   | Mybatis     |
|  3   | Redis       |
|  4   | Junit       |
|  5   | Validation  |

## 二、环境配置

| 序号 | 环境       |
| :--: | :--------- |
|  1   | Windows10  |
|  2   | Java-jdk17 |
|  3   | IDEA2023.1 |
|  4   | MySQL8.0   |

## 三、项目创建及其配置

#### 1、pom.xml文件引入依赖

```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.3</version>
    </parent>

<dependencies>
        <!--web依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--mybatis依赖-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>3.0.0</version>
        </dependency>

        <!--mysql依赖-->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
        </dependency>

    </dependencies>
```

#### 2、配置application.yaml文件

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/big_event
    username: root
    password: root
```

## 四、接口开发

#### 1、用户模块

| 序号 | 模块             |
| ---- | ---------------- |
| 1    | 注册             |
| 2    | 登录             |
| 3    | 获取用户详细信息 |
| 4    | 更新用户基本信息 |
| 5    | 更新用户头像     |
| 6    | 更新用户密码     |

##### 1.目录结构

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408042352376.png" alt="image-20240804235248991" style="zoom:50%;" />

##### 2.开发流程

| 顺序 |            任务             |                           文件                            |
| :--: | :-------------------------: | :-------------------------------------------------------: |
|  1   |          了解需求           |                         需求文档                          |
|  2   |   编写对应数据库的实体类    |                       pojo.xxx.java                       |
|  3   |     Controller业务代码      |               controller.xxxController.java               |
|  4   | 编写Service接口及其实现Impl | service.xxxService.java、service.Impl.xxxServiceImpl.java |
|  5   |     编写Mapper的SQL语句     |                   mapper.xxxMapper.java                   |
|  6   |            测试             |                             /                             |

##### 3.注册模块代码

```java
//User
package com.lin.pojo;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class User {
    private Integer id;//主键ID
    private String username;//用户名
    private String password;//密码
    private String nickname;//昵称
    private String email;//邮箱
    private String userPic;//用户头像地址
    private LocalDateTime createTime;//创建时间
    private LocalDateTime updateTime;//更新时间
}
```

```java
//Result
package com.lin.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//统一响应结果
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Result<T> {
    private Integer code;//业务状态码  0-成功  1-失败
    private String message;//提示信息
    private T data;//响应数据

    //快速返回操作成功响应结果(带响应数据)
    public static <E> Result<E> success(E data) {
        return new Result<>(0, "操作成功", data);
    }

    //快速返回操作成功响应结果
    public static Result success() {
        return new Result(0, "操作成功", null);
    }

    public static Result error(String message) {
        return new Result(1, message, null);
    }
}
```

```java
//UserController
package com.lin.controller;

import com.lin.pojo.Result;
import com.lin.pojo.User;
import com.lin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result register(String username, String password){
        //查询用户
        User u=userService.findByUserName(username);
        if (u==null){
            //没有被占用
            //注册
            userService.register(username,password);
            return Result.success();
        }else {
            //占用
            return Result.error("用户名被占用");
        }
    }
}
```

```java
//UserService
package com.lin.service;

import com.lin.pojo.User;

public interface UserService {
    //根据用户名查询用户
    User findByUserName(String username);

    //注册
    void register(String username, String password);
}
```

```java
//UserServiceImpl
package com.lin.service.Impl;

import com.lin.mapper.UserMapper;
import com.lin.pojo.User;
import com.lin.service.UserService;
import com.lin.utils.Md5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;
    @Override
    public User findByUserName(String username) {
        User u=userMapper.findByUserName(username);
        return u;
    }

    @Override
    public void register(String username, String password) {
        //加密
        String md5String=Md5Util.getMD5String(password);

        //添加
        userMapper.add(username,md5String);
    }
}
```

```java
//UserMapper
package com.lin.mapper;

import com.lin.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    //根据用户名查询用户
    @Select("select * from user where username=#{username}")
    User findByUserName(String username);

    //添加
    @Insert("insert into user(username,password,create_time,update_time)" +
            " values (#{username},#{password},now(),now())")
    void add(String username, String password);
}
```

```java
//加密文件：utils.Md5Util.java
package com.lin.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Md5Util {
    /**
     * 默认的密码字符串组合，用来将字节转换成 16 进制表示的字符,apache校验下载的文件的正确性用的就是默认的这个组合
     */
    protected static char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    protected static MessageDigest messagedigest = null;

    static {
        try {
            messagedigest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException nsaex) {
            System.err.println(Md5Util.class.getName() + "初始化失败，MessageDigest不支持MD5Util。");
            nsaex.printStackTrace();
        }
    }

    /**
     * 生成字符串的md5校验值
     *
     * @param s
     * @return
     */
    public static String getMD5String(String s) {
        return getMD5String(s.getBytes());
    }

    /**
     * 判断字符串的md5校验码是否与一个已知的md5码相匹配
     *
     * @param password  要校验的字符串
     * @param md5PwdStr 已知的md5校验码
     * @return
     */
    public static boolean checkPassword(String password, String md5PwdStr) {
        String s = getMD5String(password);
        return s.equals(md5PwdStr);
    }


    public static String getMD5String(byte[] bytes) {
        messagedigest.update(bytes);
        return bufferToHex(messagedigest.digest());
    }

    private static String bufferToHex(byte bytes[]) {
        return bufferToHex(bytes, 0, bytes.length);
    }

    private static String bufferToHex(byte bytes[], int m, int n) {
        StringBuffer stringbuffer = new StringBuffer(2 * n);
        int k = m + n;
        for (int l = m; l < k; l++) {
            appendHexPair(bytes[l], stringbuffer);
        }
        return stringbuffer.toString();
    }

    private static void appendHexPair(byte bt, StringBuffer stringbuffer) {
        char c0 = hexDigits[(bt & 0xf0) >> 4];// 取字节中高 4 位的数字转换, >>>
        // 为逻辑右移，将符号位一起右移,此处未发现两种符号有何不同
        char c1 = hexDigits[bt & 0xf];// 取字节中低 4 位的数字转换
        stringbuffer.append(c0);
        stringbuffer.append(c1);
    }

}
```

#### 2、validation校验

```txt
使用步骤如下：
1、引入依赖
2、在参数前添加@Pattern注解
3、在Controller类上添加@Validated注解
```

```xml
<!--validation依赖-->
   <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
   </dependency>
```

```java
//UserController
package com.lin.controller;

import com.lin.pojo.Result;
import com.lin.pojo.User;
import com.lin.service.UserService;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result register(@Pattern(regexp = "^[a-zA-Z0-9\\W]{5,16}$") String username, @Pattern(regexp = "^[a-zA-Z0-9\\W]{5,16}$") String password) {
        //查询用户
        User u = userService.findByUserName(username);
        if (u == null) {
            //没有被占用
            //注册
            userService.register(username, password);
            return Result.success();
        } else {
            //占用
            return Result.error("用户名被占用");
        }
    }
}
```

##### 1.分组校验

含义：把校验项进行归类分组，在完成不同功能的时候，校验指定中的校验项

步骤：1.定义分组；2.定义校验项指定归属的分组；3.校验时指定要校验的分组。

| 顺序 |      任务      |              步骤               |
| :--: | :------------: | :-----------------------------: |
|  1   |    定义分组    |      在实体类内部定义接口       |
|  2   |  对校验项分组  |       通过groups属性指定        |
|  3   | 校验时指定分组 | 给@Validated注解的value属性赋值 |
|  4   | 校验项默认分组 |             Default             |

##### 2.自定义校验

步骤：1.自定义注解State、message、groups、payload；2.自定义校验数据的类StateValidation；3.在需要校验的地方使用自定义注解。

```java
//anno.State.annotation
//1.自定义注解State、message、groups、payload；
package com.lin.anno;
import com.lin.validation.StateValidation;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented //元注解
@Target({FIELD}) //元注解
@Retention(RUNTIME) //元注解
@Constraint(validatedBy = {StateValidation.class})  //指定提供校验规则的类
public @interface State {
    //提供校验失败的提示信息
    String message() default "state参数只能为已发布或草稿";

    //指定分组
    Class<?>[] groups() default {};

    //负载  获取到State注解的附加信息
    Class<? extends Payload>[] payload() default {};
}
```

```java
//validation.StateValidation
//2.自定义校验数据的类StateValidation；
package com.lin.validation;
import com.lin.anno.State;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StateValidation implements ConstraintValidator<State, String> {
    //    @param value 将来要校验的数据
//    @param context 校验的上下文环境
//    @return 如果返回false，校验不通过；true则通过
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        //提供校验规则
        if (value == null) {
            return false;
        }
        if (value.equals("已发布") || value.equals("草稿")) {
            return true;
        }
        return false;
    }
}
```

```java
//pojo.Article.java
//3.在需要校验的地方使用自定义注解
@Data
public class Article {
    @State
    private String state;//发布状态 已发布|草稿
}
```

#### 3、全局异常处理器

```text
使用步骤如下：
1、添加全局参数检验异常处理文件
2、创建文件：exception.GlobalExceptionHandler.java
```

```java
//GlobalExceptionHandler
package com.lin.exception;

import com.lin.pojo.Result;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public Result handleException(Exception e) {
        e.printStackTrace();
        return Result.error(StringUtils.hasLength(e.getMessage()) ? e.getMessage() : "操作失败");
    }
}
```

#### 4、身份认证——JWT（JSON Web Token）

##### 1.组成

```text
第一部分：Header，记录令牌类型，签名算法等；
第二部分：Paload（有效载荷），携带一些自定义信息，默认信息等；
第三部分：Signature（签名），防止Token被篡改、确保安全性。
```

##### 2.实现步骤

```text
1.引入java-jwt依赖
2.引入单元测试依赖
3.JWT的生成
4.JWT的验证
```

```xml
<!--1.引入java-jwt依赖-->
<!--java-jwt依赖-->
        <dependency>
            <groupId>com.auth0</groupId>
            <artifactId>java-jwt</artifactId>
            <version>4.4.0</version>
        </dependency>

<!--2.引入单元测试依赖-->
<!--单元测试依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
```

```java
//test.java.com.lin.JwtTest.java
//3.JWT的生成
package com.lin;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.Date;
import java.util.HashMap;

public class JwtTest {
    @Test
    @DisplayName("测试 JWT 生成")
    public void TestGen() {
        HashMap<Object, Object> claims = new HashMap<>();
        claims.put("id", 1);
        claims.put("username", "小林");
        //生成jwt代码
        String token = JWT.create()
                .withClaim("user", String.valueOf(claims)) //添加载荷
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12)) //设置过期时间
                .sign(Algorithm.HMAC256("lavender")); //设置加密算法,密钥

        System.out.println("Generated JWT: " + token);// 打印生成的 token
    }
    
    //4.JWT的验证
    @Test
    @DisplayName("验证JWT")
    public void testParse() {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
                ".eyJ1c2VyIjoie2lkPTEsIHVzZXJuYW1lPeWwj-ael30iLCJleHAiOjE3MjI4ODQ3MTZ9" +
                ".rS-7_gH4EtZD_BHCuA0BKiSfy2YZNQokMuipYSQlm9g";
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256("lavender")).build();
        DecodedJWT decodedJWT = jwtVerifier.verify(token);
        Map<String, Claim> claims = decodedJWT.getClaims();
        System.out.println(claims.get("user"));
        //如果篡改头部和载荷部分的数据，验证失败
        //如果密钥更改，验证失败
        //token过期
    }
}
```

##### 3.已经封装好的JWT

```java
//utils.JwtUtils.java
package com.lin.utils;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import java.util.Date;
import java.util.Map;

public class JwtUtil {

    private static final String KEY = "lavender";

	//接收业务数据,生成token并返回
    public static String genToken(Map<String, Object> claims) {
        return JWT.create()
                .withClaim("claims", claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12))
                .sign(Algorithm.HMAC256(KEY));
    }

	//接收token,验证token,并返回业务数据
    public static Map<String, Object> parseToken(String token) {
        return JWT.require(Algorithm.HMAC256(KEY))
                .build()
                .verify(token)
                .getClaim("claims")
                .asMap();
    }
}
```

#### 5、全局的拦截器

```java
//config.WebConfig.java
package com.lin.config;
import com.lin.interceptors.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //登录接口和注册接口不拦截
        registry.addInterceptor(loginInterceptor).excludePathPatterns("/user/login", "/user/register");
    }
}
```

#### 6、使用ThreadLocal优化用户信息获取

```
ThreadLocal
1、用于存取数据：set()/get()
2、线程安全
3、使用remove()方法释放
```

```java
//工具类：utils.ThreadLocalUtil.java
package com.lin.utils;
import java.util.HashMap;
import java.util.Map;

/**
 * ThreadLocal 工具类
 */
@SuppressWarnings("all")
public class ThreadLocalUtil {
    //提供ThreadLocal对象,
    private static final ThreadLocal THREAD_LOCAL = new ThreadLocal();

    //根据键获取值
    public static <T> T get(){
        return (T) THREAD_LOCAL.get();
    }

    //存储键值对
    public static void set(Object value){
        THREAD_LOCAL.set(value);
    }


    //清除ThreadLocal 防止内存泄漏
    public static void remove(){
        THREAD_LOCAL.remove();
    }
}
```

```java
//UserController.java部分代码优化
@GetMapping("/userInfo")
    public Result<User> userInfo() {
        //根据用户名查询用户
        Map<String, Object> map = ThreadLocalUtil.get();
        String username = (String) map.get("username");
        User user = userService.findByUserName(username);
        return Result.success(user);
    }
```

```java
//interceptors.LoginInterceptor代码更新
package com.lin.interceptors;

import com.lin.utils.JwtUtil;
import com.lin.utils.ThreadLocalUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.test.annotation.Commit;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    //注册
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //令牌验证
        String token = request.getHeader("Authorization");
        //验证token
        try {
            Map<String, Object> claims = JwtUtil.parseToken(token);
            //把业务数据存储到ThreadLocal中
            ThreadLocalUtil.set(claims);
            //放行
            return true;
        } catch (Exception e) {
            //http响应码401
            response.setStatus(401);
            //不放行
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        //移除ThreadLocal中的数据
        ThreadLocalUtil.remove();
    }
}
```

#### 7、文章分类模块

| 序号 | 模块             |
| ---- | ---------------- |
| 1    | 文章分类列表     |
| 2    | 新增文章分类     |
| 3    | 更新文章分类     |
| 4    | 获取文章分类详情 |
| 5    | 删除文章分类     |

#### 8、文章管理模块

| 序号 | 模块                 |
| ---- | -------------------- |
| 1    | 新增文章             |
| 2    | 文章列表（条件分页） |
| 3    | 获取文章详情         |
| 4    | 更新文章             |
| 5    | 删除文章             |

#### 9、分页查询和Mybatis动态查询

##### 1.分页查询

| 顺序 | 任务                             | 文件                     |
| ---- | -------------------------------- | ------------------------ |
| 1    | Controller完成业务逻辑           | CategoryController.java  |
| 2    | 借助PageHelper完成查询(引入依赖) | CategoryServiceImpl.java |
| 3    | 编写SQL                          | CategoryMapper.interface |

```java
//实体类PageBean.java
package com.lin.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

//分页返回结果对象
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageBean <T>{
    private Long total;//总条数
    private List<T> items;//当前页数据集合
}
```

```java
//CategoryController.java
@GetMapping
    public Result<PageBean<Article>> list(
            Integer pageNum,
            Integer pageSize,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String state
    ){
        PageBean<Article> pb=articleService.list(pageNum,pageSize,categoryId,state);
        return Result.success(pb);
    }
```

```xml
<!--pom依赖-->
     <!--pageHelper坐标-->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.4.6</version>
        </dependency>
```

```java
//CategoryServiceImpl.java
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
```

```java
//CategoryMapper.interface
List<Article> list(Integer userId, Integer categoryId, String state);
```

##### 2.Mybatis动态查询

```java
//resource.con.lin.mapper.ArticleMapper.xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.lin.mapper.ArticleMapper">
    <!--    动态sql-->
    <select id="list" resultType="com.lin.pojo.Article">
        select * from article
        <where>
            <if test="categoryId != null">
                category_id = #{categoryId}
            </if>
            <if test="state != null">
                and state = #{state}
            </if>
            and create_user = #{userId}
        </where>
    </select>
</mapper>
```

#### 10、使用阿里云对象存储OSS进行上传文件

##### 1.步骤

| 步骤 | 任务                              | 文件                            |
| ---- | --------------------------------- | ------------------------------- |
| 1    | 通过注册、创建bucket得到AccessKey | /                               |
| 2    | 引入pom依赖                       | pom.xml                         |
| 3    | 参照官方SDK入门程序进行改造       | utils.AliOssUtil                |
| 4    | 在自己的Controller写业务代码      | controller.FileUploadController |

##### 2.代码

```xml
<!--OSS Java SDK-->
        <dependency>
            <groupId>com.aliyun.oss</groupId>
            <artifactId>aliyun-sdk-oss</artifactId>
            <version>3.17.4</version>
        </dependency>

        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>2.3.1</version>
        </dependency>
        <dependency>
            <groupId>javax.activation</groupId>
            <artifactId>activation</artifactId>
            <version>1.1.1</version>
        </dependency>
        <!-- no more than 2.3.3-->
        <dependency>
            <groupId>org.glassfish.jaxb</groupId>
            <artifactId>jaxb-runtime</artifactId>
            <version>2.3.3</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.1</version>
            <scope>test</scope>
        </dependency>
```

```java
package com.lin.utils;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.PutObjectRequest;
import com.aliyun.oss.model.PutObjectResult;

import java.io.FileInputStream;
import java.io.InputStream;

public class AliOssUtil {

    private static final String ENDPOINT = "https://自己选择的endpoint";
    // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
    private static final String ACCESS_KEY_ID = "自己的id";
    private static final String ACCESS_KEY_SECRET = "自己的secret";
    // 填写Bucket名称，例如examplebucket。
    private static final String BUCKET_NAME = "自己的项目名称";

    public static String uploadFile(String objectName, InputStream in) throws Exception {

        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(ENDPOINT, ACCESS_KEY_ID, ACCESS_KEY_SECRET);
        String URL = "";
        try {
            // 创建PutObjectRequest对象。
            PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, objectName, in);
            // 如果需要上传时设置存储类型和访问权限，请参考以下示例代码。
            // ObjectMetadata metadata = new ObjectMetadata();
            // metadata.setHeader(OSSHeaders.OSS_STORAGE_CLASS, StorageClass.Standard.toString());
            // metadata.setObjectAcl(CannedAccessControlList.Private);
            // putObjectRequest.setMetadata(metadata);

            // 上传文件。
            PutObjectResult result = ossClient.putObject(putObjectRequest);
//            url组成：https://bucket名称.区域节点/objectName
            URL = "https://" + BUCKET_NAME + "." + ENDPOINT.substring(ENDPOINT.lastIndexOf("/") + 1) + "/" + objectName;
        } catch (OSSException oe) {
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
        } catch (ClientException ce) {
            System.out.println("Caught an ClientException, which means the client encountered "
                    + "a serious internal problem while trying to communicate with OSS, "
                    + "such as not being able to access the network.");
            System.out.println("Error Message:" + ce.getMessage());
        } finally {
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
        return URL;
    }
}
```

```java
@RestController
public class FileUploadController {
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file) throws Exception {
        //将文件的内容存储到本地磁盘上
        String originalFilename = file.getOriginalFilename();
        //保证文件的名字是唯一的，避免文件名重复和文件覆盖
        String fileName = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));
        String url = AliOssUtil.uploadFile(fileName, file.getInputStream());
        return Result.success(url);

    }
}
```

### 五、使用Redis做登录缓存

#### 步骤

| 步骤 | 任务                                                  | 文件                              |
| ---- | ----------------------------------------------------- | --------------------------------- |
| 1    | 引入依赖，配置yaml文件                                | pom.xml,application.yaml          |
| 2    | 用户登录成功将令牌存储到redis中                       | controller.UserController.java    |
| 3    | 验证浏览器携带令牌并同时获取redis中存储与之相同的令牌 | interceptor.LoginInterceptor.java |
| 4    | 用户修改密码成功，删除redis中存储的旧令牌             | controller.UserController.java    |

```xml
<!--步骤1-->
<!--redis-->
<dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

```yaml
#application.yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
```

```java
//controller.UserController.java
@Autowired
private UserService userService;
@Autowired
private StringRedisTemplate stringRedisTemplate;

@PostMapping("/login")
    public Result<String> login(@Pattern(regexp = "^\\S{5,16}$") String username, @Pattern(regexp = "^\\S{5,16}$") String password) {
        //根据用户名查询用户
        User loginUser = userService.findByUserName(username);
        //判断该用户是否存在
        if (loginUser == null) {
            return Result.error("用户名错误");
        }

        //判断密码是否正确  loginUser对象中的password是密文
        if (Md5Util.getMD5String(password).equals(loginUser.getPassword())) {
            //登录成功
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", loginUser.getId());
            claims.put("username", loginUser.getUsername());
            String token = JwtUtil.genToken(claims);
            //把token存储到redis中
            ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
            operations.set(token, token, 1, TimeUnit.HOURS);
            return Result.success(token);
        }
        return Result.error("密码错误");
    }
```

```java
//interceptor.LoginInterceptor.java
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //令牌验证
        String token = request.getHeader("Authorization");
        //验证token
        try {
            //从redis中获取相同的token
            ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
            String redisToken = operations.get(token);
            if (redisToken==null){
//              token已经失效了
                throw new RuntimeException();
            }
            Map<String, Object> claims = JwtUtil.parseToken(token);

            //把业务数据存储到ThreadLocal中
            ThreadLocalUtil.set(claims);
            //放行
            return true;
        } catch (Exception e) {
//            http响应状态码为401
            response.setStatus(401);
            //不放行
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        //清空ThreadLocal中的数据
        ThreadLocalUtil.remove();
    }
}
```

```java
//controller.UserController.java
@PatchMapping("/updatePwd")
    public Result updatePwd(@RequestBody Map<String, String> params, @RequestHeader("Authorization") String token) {
        //1.校验参数
        String oldPwd = params.get("old_pwd");
        String newPwd = params.get("new_pwd");
        String rePwd = params.get("re_pwd");

        if (!StringUtils.hasLength(oldPwd) || !StringUtils.hasLength(newPwd) || !StringUtils.hasLength(rePwd)) {
            return Result.error("缺少必要的参数");
        }

        //原密码是否正确
        //调用userService根据用户名拿到原密码,再和old_pwd比对
        Map<String, Object> map = ThreadLocalUtil.get();
        String username = (String) map.get("username");
        User loginUser = userService.findByUserName(username);
        if (!loginUser.getPassword().equals(Md5Util.getMD5String(oldPwd))) {
            return Result.error("原密码填写不正确");
        }

        //newPwd和rePwd是否一样
        if (!rePwd.equals(newPwd)) {
            return Result.error("两次填写的新密码不一样");
        }

        //2.调用service完成密码更新
        userService.updatePwd(newPwd);
//        //删除redis中对应的token
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        operations.getOperations().delete(token);
        return Result.success();
    }
```

### 六、项目部署

#### 步骤

| 步骤 | 任务                      | 文件    |
| ---- | ------------------------- | ------- |
| 1    | 引入打包插件（jar）       | pom.xml |
| 2    | maven打包项目             | /       |
| 3    | 得到jar包并在通过命令部署 | /       |

```xml
<!--步骤1.引入打包插件-pom.xml-->
<build>
        <plugins>
            <!--打包插件-->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

步骤2  maven打包项目

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408071931766.png" alt="image-20240807193143211" style="zoom: 50%;" />

步骤3 得到jar包并在通过命令部署

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408071945917.png" alt="image-20240807194523739" style="zoom: 45%;" />

### 七、多环境开发-文件配置

#### 1.不同的生产环境下使用不同的配置文件

#### 2.单文件配置

| 序号 | 字符                              | 功能               |
| ---- | --------------------------------- | ------------------ |
| 1    | ---                               | 分割不同环境的配置 |
| 2    | spring.config.activate.on-profile | 配置所属的环境     |
| 3    | spring.profiles.active            | 激活环境           |

#### 3.多文件配置

![image-20240807200046990](https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408072004606.png)

#### 4.配置文件分组

##### 1将不同功能的配置单独写到一个yml文件

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408072006109.png" alt="image-20240807200620012" style="zoom:50%;" />

##### 2.使用以下方法将以上三个配置文件进行分组,激活使用时则是以上三个文件同时被激活

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408072006210.png" alt="image-20240807200650121" style="zoom:50%;" />
