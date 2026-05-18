package com.quizbyte.controller;

import com.quizbyte.auth.UserPrincipal;
import com.quizbyte.model.QuizQuestion;
import com.quizbyte.quiz.AttemptRequest;
import com.quizbyte.quiz.AttemptResult;
import com.quizbyte.quiz.HistoryPointDto;
import com.quizbyte.quiz.QuizService;
import com.quizbyte.quiz.ThemeDetailDto;
import com.quizbyte.quiz.ThemeDto;
import com.quizbyte.repository.QuizQuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizService quizService;

    public QuizController(QuizQuestionRepository quizQuestionRepository,
                          QuizService quizService) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizService = quizService;
    }

    // ---- Endpoints legados (compat) ----

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

    @PostMapping("/{id}/validate")
    public ResponseEntity<Boolean> validateAnswer(
            @PathVariable("id") Long id,
            @RequestBody String selectedOption) {

        return quizQuestionRepository.findById(id)
                .map(question -> {
                    boolean isCorrect = question.getCorrectOption()
                            .trim()
                            .equalsIgnoreCase(selectedOption.trim().replace("\"", ""));
                    return ResponseEntity.ok(isCorrect);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---- Novos endpoints temáticos ----

    @GetMapping("/themes")
    public List<ThemeDto> listThemes(@AuthenticationPrincipal UserPrincipal principal) {
        return quizService.listThemes(principal != null ? principal.getUser() : null);
    }

    @GetMapping("/themes/{slug}")
    public ThemeDetailDto getTheme(@NonNull @PathVariable("slug") String slug) {
        return quizService.getTheme(slug);
    }

    @PostMapping("/themes/{slug}/attempts")
    public AttemptResult submitAttempt(@NonNull @PathVariable("slug") String slug,
                                       @NonNull @Valid @RequestBody AttemptRequest request,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        return quizService.submitAttempt(slug, request, principal.getUser());
    }

    @GetMapping("/themes/{slug}/history")
    public List<HistoryPointDto> history(@NonNull @PathVariable("slug") String slug,
                                         @AuthenticationPrincipal UserPrincipal principal) {
        return quizService.listHistory(slug, principal.getUser());
    }
}


