package com.quizbyte.repository;

import com.quizbyte.model.Quiz;
import com.quizbyte.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByTopicIgnoreCase(String topic);

    List<QuizQuestion> findByQuizOrderByOrderIndexAscIdAsc(Quiz quiz);

    long countByQuiz(Quiz quiz);
}


