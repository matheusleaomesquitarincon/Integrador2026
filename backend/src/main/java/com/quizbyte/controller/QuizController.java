package com.quizbyte.controller;

import com.quizbyte.model.QuizQuestion;
import com.quizbyte.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public List<QuizQuestion> list(@RequestParam(required = false) String topic) {
        return quizService.listByTopic(topic);
    }

    @PostMapping
    public QuizQuestion create(@NonNull @Valid @RequestBody QuizQuestion question) {
        return quizService.create(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizQuestion> update(@NonNull @PathVariable("id") Long id, @NonNull @Valid @RequestBody QuizQuestion updated) {
        return quizService.update(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@NonNull @PathVariable("id") Long id) {
        if (!quizService.delete(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<Boolean> validateAnswer(
            @PathVariable("id") Long id,
            @RequestBody String selectedOption) {

        return quizService.validateAnswer(id, selectedOption)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
