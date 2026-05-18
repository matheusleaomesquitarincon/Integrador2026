package com.quizbyte.repository;

import com.quizbyte.model.Answer;
import com.quizbyte.model.AnswerLike;
import com.quizbyte.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnswerLikeRepository extends JpaRepository<AnswerLike, Long> {

    Optional<AnswerLike> findByAnswerAndUser(Answer answer, User user);

    long countByAnswer(Answer answer);

    boolean existsByAnswerAndUser(Answer answer, User user);
}
