package com.quizbyte.repository;

import com.quizbyte.model.ContentTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContentTopicRepository extends JpaRepository<ContentTopic, Long> {

    Optional<ContentTopic> findBySlug(String slug);
}
