package com.quizbyte.quiz;

import com.quizbyte.model.QuizAttempt;

import java.time.Instant;

public class HistoryPointDto {

    private Long id;
    private int score;
    private int total;
    private Instant finishedAt;

    public HistoryPointDto() {
    }

    public static HistoryPointDto from(QuizAttempt a) {
        HistoryPointDto dto = new HistoryPointDto();
        dto.id = a.getId();
        dto.score = a.getScore();
        dto.total = a.getTotalQuestions();
        dto.finishedAt = a.getFinishedAt();
        return dto;
    }

    public Long getId() { return id; }
    public int getScore() { return score; }
    public int getTotal() { return total; }
    public Instant getFinishedAt() { return finishedAt; }
}
