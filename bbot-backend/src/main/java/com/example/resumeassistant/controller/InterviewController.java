// package com.example.resumeassistant.controller;

// import com.example.resumeassistant.service.AI2IService;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/interview")
// public class InterviewController {

// private final AI2IService ai2iService;

// public InterviewController(AI2IService ai2iService) {
// this.ai2iService = ai2iService;
// }

// @PostMapping("/feedback")
// public Map<String, String> getFeedback(@RequestBody Map<String, String>
// request) {
// String resume = request.get("resume");
// String question = request.get("question");
// String answer = request.get("answer");

// String feedback = ai2iService.generateFeedback(resume, question, answer);

// return Map.of(
// "question", question,
// "answer", answer,
// "feedback", feedback);
// }
// }
