package com.quizbyte.community;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class QuestionRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 10000)
    private String text;

    @NotBlank
    @Size(max = 80)
    private String topic;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}
