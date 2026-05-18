package com.quizbyte.repository;

import com.quizbyte.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    Optional<Quiz> findBySlug(String slug);

    List<Quiz> findAllByOrderByOrderIndexAscIdAsc();
}
