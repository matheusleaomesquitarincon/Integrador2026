package com.quizbyte.controller;

import com.quizbyte.model.QuizQuestion;
import com.quizbyte.repository.QuizQuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

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
        if (topic != null && !topic.isBlank()) {
            return quizQuestionRepository.findByTopicIgnoreCase(topic);
        }
        return quizQuestionRepository.findAll();
    }

    @PostMapping
    public QuizQuestion create(@Valid @RequestBody QuizQuestion question) {
        return quizQuestionRepository.save(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizQuestion> update(@PathVariable Long id, @Valid @RequestBody QuizQuestion updated) {
        Optional<QuizQuestion> existing = quizQuestionRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        return ResponseEntity.ok(quizQuestionRepository.save(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!quizQuestionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        quizQuestionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

