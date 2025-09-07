package com.example.resumeassistant.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@CrossOrigin(origins = {
        "http://localhost:5173", // local development
        "https://ip-bot-zcxi.onrender.com" // deployed frontend on Render
})
@RestController
@RequestMapping("/api")
public class FileUploadController {

    // ✅ Use relative path so it works locally & on Render
    private static final String UPLOAD_DIR = "./uploads/";

    @PostMapping("/upload-a")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("{\"status\":\"fail\", \"message\":\"File is missing or empty\"}");
        }

        String fileName = file.getOriginalFilename().replaceAll("\\s+", "_");

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            // Return a URL you can directly open
            String fileUrl = "/uploads/" + fileName;
            return ResponseEntity.ok("{\"status\":\"success\", \"fileUrl\":\"" + fileUrl + "\"}");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"error\", \"message\":\"Failed to upload file: " + e.getMessage() + "\"}");
        }
    }
}
