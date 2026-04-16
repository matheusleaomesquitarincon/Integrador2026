package com.quizbyte.controller;

import com.quizbyte.dto.AnswerValidationRequest;
import com.quizbyte.dto.AnswerValidationResponse;
import com.quizbyte.dto.QuizQuestionRequest;
import com.quizbyte.dto.QuizQuestionResponse;
import com.quizbyte.mapper.QuizQuestionMapper;
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
    public List<QuizQuestionResponse> list(@RequestParam(required = false) String topic) {
        return quizService.listByTopic(topic).stream()
                .map(QuizQuestionMapper::toResponse)
                .toList();
    }

    @PostMapping
    public QuizQuestionResponse create(@NonNull @Valid @RequestBody QuizQuestionRequest request) {
        return QuizQuestionMapper.toResponse(
                quizService.create(QuizQuestionMapper.toEntity(request))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizQuestionResponse> update(
            @NonNull @PathVariable("id") Long id,
            @NonNull @Valid @RequestBody QuizQuestionRequest request
    ) {
        return quizService.update(id, QuizQuestionMapper.toEntity(request))
                .map(QuizQuestionMapper::toResponse)
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
    public ResponseEntity<AnswerValidationResponse> validateAnswer(
            @PathVariable("id") Long id,
            @Valid @RequestBody AnswerValidationRequest request
    ) {
        return quizService.validateAnswer(id, request.selectedOption())
                .map(AnswerValidationResponse::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
