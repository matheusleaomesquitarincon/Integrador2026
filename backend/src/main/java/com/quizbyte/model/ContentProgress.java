package com.quizbyte.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(
        name = "content_progress",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_content_progress_user_slug",
                        columnNames = {"user_id", "topic_slug"}
                )
        }
)
public class ContentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_content_progress_user"))
    @JsonIgnore
    private User user;

    @Column(name = "topic_slug", nullable = false, length = 80)
    private String topicSlug;

    @Column(name = "completed_at", nullable = false, updatable = false)
    private Instant completedAt;

    public ContentProgress() {
    }

    @PrePersist
    protected void onCreate() {
        if (completedAt == null) {
            completedAt = Instant.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTopicSlug() { return topicSlug; }
    public void setTopicSlug(String topicSlug) { this.topicSlug = topicSlug; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
