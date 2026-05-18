package com.quizbyte.community;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class AnswerRequest {

    @NotBlank
    @Size(max = 10000)
    private String text;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
