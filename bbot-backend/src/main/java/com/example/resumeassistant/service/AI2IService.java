package com.example.resumeassistant.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AI2IService {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;

    public AI2IService(RestTemplate restTemplate,
            @Value("${ai2i.api.url}") String apiUrl,
            @Value("${ai2i.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    // =========================
    // Helper: Send request to AI
    // =========================
    private Map<String, Object> sendRequestToAI(Map<String, Object> requestBody) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            return restTemplate.postForObject(apiUrl, entity, Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // =========================
    // Generate Questions from Resume
    // =========================
    public List<String> generateQuestions(String resumeText, int count) {
        String prompt = "You are an AI interview assistant. Generate " + count +
                " technical and HR interview questions strictly based on this resume:\n\n" +
                resumeText;

        Map<String, Object> request = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are an expert interview question generator."),
                        Map.of("role", "user", "content", prompt)));

        Map<String, Object> response = sendRequestToAI(request);

        if (response == null || !response.containsKey("choices")) {
            return List.of("⚠️ Failed to generate questions. Please try again.");
        }

        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices.isEmpty()) {
                return List.of("⚠️ No questions received from AI.");
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");

            if (content == null || content.isBlank()) {
                return List.of("⚠️ AI returned an empty response.");
            }

            // Split into lines, remove numbering, clean formatting
            return Arrays.stream(content.split("\n"))
                    .map(line -> line.replaceAll("^[0-9]+[.)\\-]*\\s*", "")) // remove numbering like "1. "
                    .map(String::trim)
                    .filter(q -> q.length() > 5)
                    .toList();

        } catch (Exception e) {
            e.printStackTrace();
            return List.of("⚠️ Failed to parse AI response.");
        }
    }

    // =========================
    // Generate Feedback on Answer
    // =========================
    public String generateFeedback(String resumeText, String question, String answer) {
        String prompt = "You are an interview coach. Here is the candidate's resume:\n\n"
                + resumeText
                + "\n\nInterview Question:\n" + question
                + "\n\nCandidate's Answer:\n" + answer
                + "\n\nGive professional, constructive feedback with specific improvements.";

        Map<String, Object> request = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a professional interview coach."),
                        Map.of("role", "user", "content", prompt)));

        Map<String, Object> response = sendRequestToAI(request);

        if (response == null || !response.containsKey("choices")) {
            return "⚠️ Unable to generate feedback right now. Try again later.";
        }

        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices.isEmpty()) {
                return "⚠️ AI did not return any feedback.";
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");

            return (content != null && !content.isBlank())
                    ? content.trim()
                    : "⚠️ AI returned empty feedback.";

        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ Failed to parse AI feedback.";
        }
    }

    public String getAIResponse(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini"); // or your AI2I/Gemini model
            body.put("messages", List.of(
                    Map.of("role", "system", "content", "You are a helpful interview evaluator."),
                    Map.of("role", "user", "content", prompt)));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            Map<String, Object> response = restTemplate.postForObject(apiUrl, request, Map.class);

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "⚠️ Failed to fetch AI response.";
    }

}
