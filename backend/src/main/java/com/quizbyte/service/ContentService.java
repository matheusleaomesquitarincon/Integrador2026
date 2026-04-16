package com.quizbyte.service;

import com.quizbyte.model.ContentTopic;
import com.quizbyte.repository.ContentTopicRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {

    private final ContentTopicRepository contentTopicRepository;

    public ContentService(ContentTopicRepository contentTopicRepository) {
        this.contentTopicRepository = contentTopicRepository;
    }

    public List<ContentTopic> listAll() {
        return contentTopicRepository.findAll();
    }
}
