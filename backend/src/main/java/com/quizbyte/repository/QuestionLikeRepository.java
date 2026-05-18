package com.quizbyte.repository;

import com.quizbyte.model.Question;
import com.quizbyte.model.QuestionLike;
import com.quizbyte.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionLikeRepository extends JpaRepository<QuestionLike, Long> {

    Optional<QuestionLike> findByQuestionAndUser(Question question, User user);

    long countByQuestion(Question question);

    boolean existsByQuestionAndUser(Question question, User user);
}
