package com.lin;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

//如果在测试类里面，使用@SpringBootTest注解，那么测试类里面所有测试方法都会被spring容器管理
@SpringBootTest
public class RedisTest {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testSet() {
        //往redis中存储一个键值对，StringRedisTemplate
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();

        operations.set("username", "linbei");
        //存入一个键值对 id-1，过期时间为15秒
        operations.set("id", "1", 15, TimeUnit.SECONDS);
    }

    @Test
    public void TestGet() {
        //从redis获取到一个键值对
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        System.out.println(operations.get("username"));
    }
}
