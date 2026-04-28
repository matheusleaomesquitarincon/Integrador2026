package com.quizbyte.service;

import com.quizbyte.model.QuizQuestion;
import com.quizbyte.repository.QuizQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;

    public QuizService(QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionRepository = quizQuestionRepository;
    }

    public List<QuizQuestion> listByTopic(String topic) {
        if (topic != null && !topic.trim().isEmpty()) {
            return quizQuestionRepository.findByTopicIgnoreCase(topic);
        }
        return quizQuestionRepository.findAll();
    }

    public QuizQuestion create(QuizQuestion question) {
        return quizQuestionRepository.save(question);
    }

    public Optional<QuizQuestion> update(Long id, QuizQuestion updated) {
        if (!quizQuestionRepository.existsById(id)) {
            return Optional.empty();
        }
        updated.setId(id);
        return Optional.of(quizQuestionRepository.save(updated));
    }

    public boolean delete(Long id) {
        if (!quizQuestionRepository.existsById(id)) {
            return false;
        }
        quizQuestionRepository.deleteById(id);
        return true;
    }

    public Optional<Boolean> validateAnswer(Long id, String selectedOption) {
        String normalized = selectedOption.trim().replace("\"", "");
        return quizQuestionRepository.findById(id)
                .map(question -> question.getCorrectOption().trim().equalsIgnoreCase(normalized));
    }
}
