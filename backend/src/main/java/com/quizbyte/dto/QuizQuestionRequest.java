package com.quizbyte.dto;

import jakarta.validation.constraints.NotBlank;

public record QuizQuestionRequest(
        @NotBlank String topic,
        @NotBlank String questionText,
        @NotBlank String optionA,
        @NotBlank String optionB,
        @NotBlank String optionC,
        @NotBlank String optionD,
        @NotBlank String correctOption
) {
}
