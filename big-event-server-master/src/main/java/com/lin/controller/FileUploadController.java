package com.lin.controller;


import com.lin.pojo.Result;
import com.lin.utils.AliOssUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
public class FileUploadController {
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file) throws Exception {
        //将文件的内容存储到本地磁盘上
        String originalFilename = file.getOriginalFilename();
        //保证文件的名字是唯一的，避免文件名重复和文件覆盖
        String fileName = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));
//        file.transferTo(new File("D:\\doc" + fileName));
        String url = AliOssUtil.uploadFile(fileName, file.getInputStream());
        return Result.success(url);

    }
}
