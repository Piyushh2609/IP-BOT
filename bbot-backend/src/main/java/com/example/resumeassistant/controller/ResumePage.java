package com.example.resumeassistant.controller;

import com.example.resumeassistant.service.AI2IService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
@RestController
@RequestMapping("/api")
public class ResumePage {

    private static List<String> cachedQuestions = new ArrayList<>();
    private static String cachedResumeText = "";
    private static String cachedResumeUrl = "";

    @Autowired
    private AI2IService ai2iService;

    // =========================
    // Upload resume & generate questions
    // =========================
    @PostMapping("/upload-and-generate")
    public ResponseEntity<Map<String, Object>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "count", required = false, defaultValue = "50") int count) {

        Map<String, Object> response = new HashMap<>();
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists())
                dir.mkdirs();

            String originalFilename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File savedFile = new File(uploadDir + originalFilename);
            file.transferTo(savedFile);

            String resumeText = extractTextFromFile(savedFile);
            if (resumeText == null || resumeText.isEmpty()) {
                response.put("success", false);
                response.put("message", "Failed to read resume text. Please upload a valid .txt, .pdf, or .docx file.");
                response.put("questions", Collections.emptyList());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            cachedResumeText = resumeText;
            cachedResumeUrl = "http://localhost:8080/uploads/" + originalFilename;

            cachedQuestions = ai2iService.generateQuestions(resumeText, count);

            response.put("success", true);
            response.put("questions", cachedQuestions);
            response.put("resumeUrl", cachedResumeUrl);
            response.put("count", count);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Internal Server Error: " + e.getMessage());
            response.put("questions", Collections.emptyList());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // =========================
    // Resume URL endpoint (frontend can fetch resume to display in iframe)
    // =========================
    @GetMapping("/resume-url")
    public ResponseEntity<Map<String, String>> getResumeUrl() {
        if (cachedResumeUrl == null || cachedResumeUrl.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No resume uploaded yet"));
        }
        return ResponseEntity.ok(Map.of("resumeUrl", cachedResumeUrl));
    }

    // =========================
    // Helper: Extract text from file
    // =========================
    private String extractTextFromFile(File file) throws IOException {
        String fileName = file.getName().toLowerCase();
        if (fileName.endsWith(".txt")) {
            return new String(java.nio.file.Files.readAllBytes(file.toPath()));
        } else if (fileName.endsWith(".pdf")) {
            return extractTextFromPDF(file);
        } else if (fileName.endsWith(".docx")) {
            return extractTextFromDocx(file);
        } else {
            return null;
        }
    }

    private String extractTextFromPDF(File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            return new PDFTextStripper().getText(document);
        }
    }

    private String extractTextFromDocx(File file) throws IOException {
        try (FileInputStream fis = new FileInputStream(file);
                XWPFDocument doc = new XWPFDocument(fis);
                XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText();
        }
    }
}
