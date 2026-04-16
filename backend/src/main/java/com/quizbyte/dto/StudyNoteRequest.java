package com.quizbyte.dto;

import jakarta.validation.constraints.NotBlank;

public record StudyNoteRequest(
        @NotBlank String title,
        @NotBlank String text
) {
}
