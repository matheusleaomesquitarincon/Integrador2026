package com.quizbyte.quiz;

import java.time.Instant;
import java.util.List;

public class AttemptResult {

    private Long attemptId;
    private String quizSlug;
    private int score;
    private int total;
    private Instant finishedAt;
    private List<QuestionResult> results;

    public AttemptResult() {
    }

    public AttemptResult(Long attemptId,
                         String quizSlug,
                         int score,
                         int total,
                         Instant finishedAt,
                         List<QuestionResult> results) {
        this.attemptId = attemptId;
        this.quizSlug = quizSlug;
        this.score = score;
        this.total = total;
        this.finishedAt = finishedAt;
        this.results = results;
    }

    public Long getAttemptId() { return attemptId; }
    public String getQuizSlug() { return quizSlug; }
    public int getScore() { return score; }
    public int getTotal() { return total; }
    public Instant getFinishedAt() { return finishedAt; }
    public List<QuestionResult> getResults() { return results; }

    public static class QuestionResult {
        private Long questionId;
        private String chosen;
        private String correct;
        private boolean correctChoice;
        private String explanation;

        public QuestionResult() {
        }

        public QuestionResult(Long questionId,
                              String chosen,
                              String correct,
                              boolean correctChoice,
                              String explanation) {
            this.questionId = questionId;
            this.chosen = chosen;
            this.correct = correct;
            this.correctChoice = correctChoice;
            this.explanation = explanation;
        }

        public Long getQuestionId() { return questionId; }
        public String getChosen() { return chosen; }
        public String getCorrect() { return correct; }
        public boolean isCorrectChoice() { return correctChoice; }
        public String getExplanation() { return explanation; }
    }
}
