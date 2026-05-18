package com.quizbyte.quiz;

import com.quizbyte.model.QuizQuestion;

public class QuestionForUserDto {

    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    public QuestionForUserDto() {
    }

    public static QuestionForUserDto from(QuizQuestion q) {
        QuestionForUserDto dto = new QuestionForUserDto();
        dto.id = q.getId();
        dto.questionText = q.getQuestionText();
        dto.optionA = q.getOptionA();
        dto.optionB = q.getOptionB();
        dto.optionC = q.getOptionC();
        dto.optionD = q.getOptionD();
        return dto;
    }

    public Long getId() { return id; }
    public String getQuestionText() { return questionText; }
    public String getOptionA() { return optionA; }
    public String getOptionB() { return optionB; }
    public String getOptionC() { return optionC; }
    public String getOptionD() { return optionD; }
}
