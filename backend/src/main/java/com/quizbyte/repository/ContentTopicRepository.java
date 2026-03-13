package com.quizbyte.repository;

import com.quizbyte.model.ContentTopic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentTopicRepository extends JpaRepository<ContentTopic, Long> {
    ContentTopic findBySlug(String slug);
}

