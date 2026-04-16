package com.quizbyte.dto;

public record QuizQuestionResponse(
        Long id,
        String topic,
        String questionText,
        String optionA,
        String optionB,
        String optionC,
        String optionD
) {
}
