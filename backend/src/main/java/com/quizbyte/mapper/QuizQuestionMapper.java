package com.quizbyte.mapper;

import com.quizbyte.dto.QuizQuestionRequest;
import com.quizbyte.dto.QuizQuestionResponse;
import com.quizbyte.model.QuizQuestion;

public final class QuizQuestionMapper {

    private QuizQuestionMapper() {
    }

    public static QuizQuestion toEntity(QuizQuestionRequest request) {
        QuizQuestion question = new QuizQuestion();
        question.setTopic(request.topic());
        question.setQuestionText(request.questionText());
        question.setOptionA(request.optionA());
        question.setOptionB(request.optionB());
        question.setOptionC(request.optionC());
        question.setOptionD(request.optionD());
        question.setCorrectOption(request.correctOption());
        return question;
    }

    public static QuizQuestionResponse toResponse(QuizQuestion entity) {
        return new QuizQuestionResponse(
                entity.getId(),
                entity.getTopic(),
                entity.getQuestionText(),
                entity.getOptionA(),
                entity.getOptionB(),
                entity.getOptionC(),
                entity.getOptionD()
        );
    }
}
