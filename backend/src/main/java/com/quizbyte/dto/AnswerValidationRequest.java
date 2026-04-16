package com.quizbyte.dto;

import jakarta.validation.constraints.NotBlank;

public record AnswerValidationRequest(
        @NotBlank String selectedOption
) {
}
