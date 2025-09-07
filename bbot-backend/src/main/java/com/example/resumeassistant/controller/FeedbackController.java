package com.example.resumeassistant.controller;

import com.example.resumeassistant.service.AI2IService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    @Autowired
    private AI2IService ai2iService;

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, String>> feedback(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String answer = payload.get("answer");
        String resumeText = payload.getOrDefault("resume", ""); // optional for anonymous section

        try {
            // AI prompt: returns feedback + improved answer
            String prompt = "You are an interview evaluator. Based on the resume (if provided), "
                    + "the interview question, and the candidate's answer, give constructive feedback "
                    + "and an improved version of the answer.\n\n"
                    + "Return STRICT JSON in the format:\n"
                    + "{ \"feedback\": \"...\", \"improvedAnswer\": \"...\" }\n\n"
                    + "Resume:\n" + resumeText + "\n\n"
                    + "Question: " + question + "\n"
                    + "Answer: " + answer + "\n\n"
                    + "Return ONLY valid JSON, no explanations.";

            String aiResponse = ai2iService.getAIResponse(prompt);
            Map<String, String> responseMap = new HashMap<>();

            try {
                // ✅ Extract JSON from AI response even if it has extra text
                Pattern pattern = Pattern.compile("\\{.*\\}", Pattern.DOTALL);
                Matcher matcher = pattern.matcher(aiResponse.trim());

                if (matcher.find()) {
                    String jsonString = matcher.group();
                    responseMap = new ObjectMapper().readValue(jsonString, Map.class);

                    // Map improvedAnswer → correctAnswer for frontend
                    if (responseMap.containsKey("improvedAnswer")) {
                        responseMap.put("correctAnswer", responseMap.get("improvedAnswer"));
                        responseMap.remove("improvedAnswer");
                    }
                } else {
                    // fallback if AI didn't return valid JSON
                    responseMap.put("feedback", aiResponse);
                    responseMap.put("correctAnswer", "");
                }
            } catch (Exception e) {
                e.printStackTrace();
                responseMap.put("feedback", aiResponse);
                responseMap.put("correctAnswer", "");
            }

            return ResponseEntity.ok(responseMap);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "feedback", "❌ Error generating AI feedback: " + e.getMessage(),
                            "correctAnswer", ""));
        }
    }
}
