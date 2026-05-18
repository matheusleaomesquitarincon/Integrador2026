package com.quizbyte.repository;

import com.quizbyte.model.ContentProgress;
import com.quizbyte.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContentProgressRepository extends JpaRepository<ContentProgress, Long> {

    List<ContentProgress> findByUser(User user);

    Optional<ContentProgress> findByUserAndTopicSlug(User user, String topicSlug);

    long deleteByUserAndTopicSlug(User user, String topicSlug);
}
