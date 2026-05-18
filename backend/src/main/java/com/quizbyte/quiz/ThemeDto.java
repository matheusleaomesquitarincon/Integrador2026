package com.quizbyte.quiz;

import com.quizbyte.model.Quiz;

import java.time.Instant;

public class ThemeDto {

    private String slug;
    private String title;
    private String description;
    private String icon;
    private Integer orderIndex;
    private long questionCount;
    private Integer lastScore;
    private Integer lastTotal;
    private Instant lastAttemptAt;
    private long attemptCount;
    private Integer bestScore;

    public ThemeDto() {
    }

    public static ThemeDto from(Quiz quiz,
                                long questionCount,
                                Integer lastScore,
                                Integer lastTotal,
                                Instant lastAttemptAt,
                                long attemptCount,
                                Integer bestScore) {
        ThemeDto dto = new ThemeDto();
        dto.slug = quiz.getSlug();
        dto.title = quiz.getTitle();
        dto.description = quiz.getDescription();
        dto.icon = quiz.getIcon();
        dto.orderIndex = quiz.getOrderIndex();
        dto.questionCount = questionCount;
        dto.lastScore = lastScore;
        dto.lastTotal = lastTotal;
        dto.lastAttemptAt = lastAttemptAt;
        dto.attemptCount = attemptCount;
        dto.bestScore = bestScore;
        return dto;
    }

    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getIcon() { return icon; }
    public Integer getOrderIndex() { return orderIndex; }
    public long getQuestionCount() { return questionCount; }
    public Integer getLastScore() { return lastScore; }
    public Integer getLastTotal() { return lastTotal; }
    public Instant getLastAttemptAt() { return lastAttemptAt; }
    public long getAttemptCount() { return attemptCount; }
    public Integer getBestScore() { return bestScore; }
}
