package com.quizbyte.community;

public class CommunityEvent {

    public enum Type {
        QUESTION_CREATED,
        QUESTION_UPDATED,
        QUESTION_DELETED,
        QUESTION_LIKED,
        ANSWER_CREATED,
        ANSWER_UPDATED,
        ANSWER_DELETED,
        ANSWER_LIKED,
        ANSWER_ACCEPTED
    }

    private Type type;
    private Long questionId;
    private Long answerId;
    private QuestionDto question;
    private AnswerDto answer;
    private long likeCount;

    public CommunityEvent() {
    }

    public static CommunityEvent question(Type type, QuestionDto question) {
        CommunityEvent e = new CommunityEvent();
        e.type = type;
        e.questionId = question != null ? question.getId() : null;
        e.question = question;
        return e;
    }

    public static CommunityEvent questionDeleted(Long questionId) {
        CommunityEvent e = new CommunityEvent();
        e.type = Type.QUESTION_DELETED;
        e.questionId = questionId;
        return e;
    }

    public static CommunityEvent questionLiked(Long questionId, long likeCount) {
        CommunityEvent e = new CommunityEvent();
        e.type = Type.QUESTION_LIKED;
        e.questionId = questionId;
        e.likeCount = likeCount;
        return e;
    }

    public static CommunityEvent answer(Type type, AnswerDto answer) {
        CommunityEvent e = new CommunityEvent();
        e.type = type;
        e.questionId = answer != null ? answer.getQuestionId() : null;
        e.answerId = answer != null ? answer.getId() : null;
        e.answer = answer;
        return e;
    }

    public static CommunityEvent answerDeleted(Long questionId, Long answerId) {
        CommunityEvent e = new CommunityEvent();
        e.type = Type.ANSWER_DELETED;
        e.questionId = questionId;
        e.answerId = answerId;
        return e;
    }

    public static CommunityEvent answerLiked(Long questionId, Long answerId, long likeCount) {
        CommunityEvent e = new CommunityEvent();
        e.type = Type.ANSWER_LIKED;
        e.questionId = questionId;
        e.answerId = answerId;
        e.likeCount = likeCount;
        return e;
    }

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public Long getAnswerId() { return answerId; }
    public void setAnswerId(Long answerId) { this.answerId = answerId; }

    public QuestionDto getQuestion() { return question; }
    public void setQuestion(QuestionDto question) { this.question = question; }

    public AnswerDto getAnswer() { return answer; }
    public void setAnswer(AnswerDto answer) { this.answer = answer; }

    public long getLikeCount() { return likeCount; }
    public void setLikeCount(long likeCount) { this.likeCount = likeCount; }
}
