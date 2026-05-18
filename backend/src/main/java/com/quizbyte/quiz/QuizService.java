package com.quizbyte.quiz;

import com.quizbyte.model.Quiz;
import com.quizbyte.model.QuizAttempt;
import com.quizbyte.model.QuizQuestion;
import com.quizbyte.model.User;
import com.quizbyte.repository.QuizAttemptRepository;
import com.quizbyte.repository.QuizQuestionRepository;
import com.quizbyte.repository.QuizRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;

    public QuizService(QuizRepository quizRepository,
                       QuizQuestionRepository questionRepository,
                       QuizAttemptRepository attemptRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
    }

    @Transactional(readOnly = true)
    public List<ThemeDto> listThemes(User viewer) {
        return quizRepository.findAllByOrderByOrderIndexAscIdAsc().stream()
                .map(q -> toThemeDto(q, viewer))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ThemeDetailDto getTheme(String slug) {
        Quiz quiz = requireQuiz(slug);
        List<QuestionForUserDto> questions = questionRepository
                .findByQuizOrderByOrderIndexAscIdAsc(quiz).stream()
                .map(QuestionForUserDto::from)
                .collect(Collectors.toList());
        return new ThemeDetailDto(quiz.getSlug(), quiz.getTitle(), quiz.getDescription(), quiz.getIcon(), questions);
    }

    @Transactional
    public AttemptResult submitAttempt(String slug, AttemptRequest request, User user) {
        Quiz quiz = requireQuiz(slug);
        List<QuizQuestion> questions = questionRepository.findByQuizOrderByOrderIndexAscIdAsc(quiz);
        if (questions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quiz sem perguntas cadastradas");
        }

        Map<Long, String> userAnswers = new HashMap<>();
        if (request.getAnswers() != null) {
            for (AttemptRequest.Answer a : request.getAnswers()) {
                if (a.getQuestionId() != null) {
                    userAnswers.put(a.getQuestionId(), a.getChoice());
                }
            }
        }

        int score = 0;
        List<AttemptResult.QuestionResult> results = new ArrayList<>();
        for (QuizQuestion q : questions) {
            String chosen = userAnswers.get(q.getId());
            String correct = q.getCorrectOption();
            boolean ok = correct != null
                    && chosen != null
                    && correct.trim().equalsIgnoreCase(chosen.trim());
            if (ok) score++;
            results.add(new AttemptResult.QuestionResult(
                    q.getId(),
                    chosen,
                    correct,
                    ok,
                    q.getExplanation()
            ));
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(quiz);
        attempt.setScore(score);
        attempt.setTotalQuestions(questions.size());
        QuizAttempt saved = attemptRepository.save(attempt);

        return new AttemptResult(
                saved.getId(),
                quiz.getSlug(),
                score,
                questions.size(),
                saved.getFinishedAt(),
                results
        );
    }

    @Transactional(readOnly = true)
    public List<HistoryPointDto> listHistory(String slug, User user) {
        Quiz quiz = requireQuiz(slug);
        return attemptRepository.findByUserAndQuizOrderByFinishedAtAsc(user, quiz).stream()
                .map(HistoryPointDto::from)
                .collect(Collectors.toList());
    }

    private Quiz requireQuiz(String slug) {
        return quizRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz não encontrado"));
    }

    private ThemeDto toThemeDto(Quiz quiz, User viewer) {
        long questionCount = questionRepository.countByQuiz(quiz);
        Integer lastScore = null;
        Integer lastTotal = null;
        java.time.Instant lastAt = null;
        long attemptCount = 0;
        Integer bestScore = null;

        if (viewer != null) {
            List<QuizAttempt> all = attemptRepository.findByUserAndQuizOrderByFinishedAtAsc(viewer, quiz);
            attemptCount = all.size();
            if (!all.isEmpty()) {
                QuizAttempt last = all.get(all.size() - 1);
                lastScore = last.getScore();
                lastTotal = last.getTotalQuestions();
                lastAt = last.getFinishedAt();
                bestScore = all.stream().mapToInt(QuizAttempt::getScore).max().orElse(0);
            }
        }

        return ThemeDto.from(quiz, questionCount, lastScore, lastTotal, lastAt, attemptCount, bestScore);
    }
}
