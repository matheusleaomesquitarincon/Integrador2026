package com.quizbyte.dto;

public record ContentTopicResponse(
        Long id,
        String slug,
        String title,
        String description
) {
}
