package com.quizbyte.quiz;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class AttemptRequest {

    @NotEmpty
    private List<Answer> answers;

    public List<Answer> getAnswers() { return answers; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }

    public static class Answer {
        @NotNull
        private Long questionId;
        private String choice;

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public String getChoice() { return choice; }
        public void setChoice(String choice) { this.choice = choice; }
    }
}
