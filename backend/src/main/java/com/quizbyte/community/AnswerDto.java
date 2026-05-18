package com.quizbyte.community;

import com.quizbyte.model.Answer;

import java.time.Instant;

public class AnswerDto {

    private Long id;
    private Long questionId;
    private String text;
    private boolean accepted;
    private Instant createdAt;
    private Instant updatedAt;
    private AuthorDto author;
    private long likeCount;
    private boolean likedByMe;

    public AnswerDto() {
    }

    public static AnswerDto from(Answer a, long likeCount, boolean likedByMe) {
        AnswerDto dto = new AnswerDto();
        dto.id = a.getId();
        dto.questionId = a.getQuestion() != null ? a.getQuestion().getId() : null;
        dto.text = a.getText();
        dto.accepted = a.isAccepted();
        dto.createdAt = a.getCreatedAt();
        dto.updatedAt = a.getUpdatedAt();
        dto.author = AuthorDto.from(a.getAuthor());
        dto.likeCount = likeCount;
        dto.likedByMe = likedByMe;
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public boolean isAccepted() { return accepted; }
    public void setAccepted(boolean accepted) { this.accepted = accepted; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public AuthorDto getAuthor() { return author; }
    public void setAuthor(AuthorDto author) { this.author = author; }

    public long getLikeCount() { return likeCount; }
    public void setLikeCount(long likeCount) { this.likeCount = likeCount; }

    public boolean isLikedByMe() { return likedByMe; }
    public void setLikedByMe(boolean likedByMe) { this.likedByMe = likedByMe; }
}
