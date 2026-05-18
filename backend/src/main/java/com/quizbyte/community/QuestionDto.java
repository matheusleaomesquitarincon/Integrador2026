package com.quizbyte.community;

import com.quizbyte.model.Question;

import java.time.Instant;

public class QuestionDto {

    private Long id;
    private String title;
    private String text;
    private String topic;
    private Instant createdAt;
    private Instant updatedAt;
    private AuthorDto author;
    private long answerCount;
    private long likeCount;
    private boolean likedByMe;
    private boolean hasAcceptedAnswer;

    public QuestionDto() {
    }

    public static QuestionDto from(Question q,
                                   long answerCount,
                                   long likeCount,
                                   boolean likedByMe,
                                   boolean hasAcceptedAnswer) {
        QuestionDto dto = new QuestionDto();
        dto.id = q.getId();
        dto.title = q.getTitle();
        dto.text = q.getText();
        dto.topic = q.getTopic();
        dto.createdAt = q.getCreatedAt();
        dto.updatedAt = q.getUpdatedAt();
        dto.author = AuthorDto.from(q.getAuthor());
        dto.answerCount = answerCount;
        dto.likeCount = likeCount;
        dto.likedByMe = likedByMe;
        dto.hasAcceptedAnswer = hasAcceptedAnswer;
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public AuthorDto getAuthor() { return author; }
    public void setAuthor(AuthorDto author) { this.author = author; }

    public long getAnswerCount() { return answerCount; }
    public void setAnswerCount(long answerCount) { this.answerCount = answerCount; }

    public long getLikeCount() { return likeCount; }
    public void setLikeCount(long likeCount) { this.likeCount = likeCount; }

    public boolean isLikedByMe() { return likedByMe; }
    public void setLikedByMe(boolean likedByMe) { this.likedByMe = likedByMe; }

    public boolean isHasAcceptedAnswer() { return hasAcceptedAnswer; }
    public void setHasAcceptedAnswer(boolean hasAcceptedAnswer) { this.hasAcceptedAnswer = hasAcceptedAnswer; }
}
