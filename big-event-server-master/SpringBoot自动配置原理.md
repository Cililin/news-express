## SpringBoot自动配置原理

### 1、在主启动类上添加了==SpringBootApplication==注解，该注解组合了==Enable Auto Configuration==注解

![image-20240804154033611](https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408041540187.png)

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408041541830.png" alt="image-20240804154153775" style="zoom: 60%;" />

### 2、EnableAutoConfiguration注解组合了==Import==注解，导入了==AutoConfigurationImportSelector类==

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408041542198.png" alt="image-20240804154247153" style="zoom:67%;" />

### 3、实现==selectImports方法==，该方法经过层层调用，最终读取META-INF目录下的，后缀名为==imports==的文件。（boot2.7以前版本，读取的是spring.factories文件）

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408041543508.png" alt="image-20240804154343457" style="zoom: 60%;" />

<img src="https://gitee.com/Cililin/typoa-bed-no.1/raw/master/Image/202408041607130.png" alt="image-20240804160720075" style="zoom: 89%;" />

### 4、读取到全类名后会解析注册条件，也就是==@Conditional及其衍生注解==，把满足注册条件的Bean对象自动注入到IOC容器中。