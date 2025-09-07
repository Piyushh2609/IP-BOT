package com.example.resumeassistant.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
@RestController
@RequestMapping("/api")
public class FileUploadController {

    // Use a proper directory on your system
    private static final String UPLOAD_DIR = "C:/uploads/";

    @PostMapping("/upload-a")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        // 1️⃣ Validate file
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("{\"status\":\"fail\", \"message\":\"File is missing or empty\"}");
        }

        String fileName = file.getOriginalFilename().replaceAll("\\s+", "_"); // sanitize file name

        try {
            // 2️⃣ Prepare target directory
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 3️⃣ Save file
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            // 4️⃣ Return success response
            return ResponseEntity.ok("{\"status\":\"success\", \"fileName\":\"" + fileName + "\"}");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"error\", \"message\":\"Failed to upload file: " + e.getMessage() + "\"}");
        }
    }
}
