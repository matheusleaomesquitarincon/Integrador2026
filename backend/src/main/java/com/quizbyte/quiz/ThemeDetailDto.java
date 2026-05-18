package com.quizbyte.quiz;

import java.util.List;

public class ThemeDetailDto {

    private String slug;
    private String title;
    private String description;
    private String icon;
    private List<QuestionForUserDto> questions;

    public ThemeDetailDto() {
    }

    public ThemeDetailDto(String slug,
                          String title,
                          String description,
                          String icon,
                          List<QuestionForUserDto> questions) {
        this.slug = slug;
        this.title = title;
        this.description = description;
        this.icon = icon;
        this.questions = questions;
    }

    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getIcon() { return icon; }
    public List<QuestionForUserDto> getQuestions() { return questions; }
}
