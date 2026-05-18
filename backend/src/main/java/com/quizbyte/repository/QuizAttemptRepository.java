package com.quizbyte.repository;

import com.quizbyte.model.Quiz;
import com.quizbyte.model.QuizAttempt;
import com.quizbyte.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserAndQuizOrderByFinishedAtAsc(User user, Quiz quiz);

    Optional<QuizAttempt> findFirstByUserAndQuizOrderByFinishedAtDesc(User user, Quiz quiz);
}
