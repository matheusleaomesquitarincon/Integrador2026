package com.quizbyte.controller;

import com.quizbyte.model.QuizQuestion;
import com.quizbyte.repository.QuizQuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final QuizQuestionRepository quizQuestionRepository;

    public QuizController(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    @GetMapping
    public List<QuizQuestion> list(@RequestParam(required = false) String topic) {
        if (topic != null && !topic.trim().isEmpty()) {
            return quizQuestionRepository.findByTopicIgnoreCase(topic);
        }
        return quizQuestionRepository.findAll();
    }

    @PostMapping
    public QuizQuestion create(@NonNull @Valid @RequestBody QuizQuestion question) {
        return quizQuestionRepository.save(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizQuestion> update(@NonNull @PathVariable("id") Long id, @NonNull @Valid @RequestBody QuizQuestion updated) {
        if (!quizQuestionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        return ResponseEntity.ok(quizQuestionRepository.save(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@NonNull @PathVariable("id") Long id) {
        if (!quizQuestionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        quizQuestionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

