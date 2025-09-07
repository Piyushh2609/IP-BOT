package com.example.resumeassistant.service;

import com.example.resumeassistant.util.PdfParser;
import org.springframework.stereotype.Service;

@Service
public class ResumeService {
    public String parseResume(String filepath) {
        String text = PdfParser.extractText(filepath);
        if (text.length() < 200) {
            System.out.println("[WARNING] Resume content may be too short.");
        }
        return text;
    }
}
