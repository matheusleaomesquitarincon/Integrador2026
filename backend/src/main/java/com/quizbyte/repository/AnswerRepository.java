package com.quizbyte.repository;

import com.quizbyte.model.Answer;
import com.quizbyte.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByQuestionOrderByCreatedAtAsc(Question question);

    long countByQuestion(Question question);

    @Modifying
    @Query("update Answer a set a.accepted = false where a.question = :question and a.id <> :keepId")
    void unacceptOthers(@Param("question") Question question, @Param("keepId") Long keepId);
}
