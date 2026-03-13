package com.quizbyte.controller;

import com.quizbyte.model.ContentTopic;
import com.quizbyte.repository.ContentTopicRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
@CrossOrigin(origins = "http://localhost:5173")
public class ContentController {

    private final ContentTopicRepository contentTopicRepository;

    public ContentController(ContentTopicRepository contentTopicRepository) {
        this.contentTopicRepository = contentTopicRepository;
    }

    @GetMapping
    public List<ContentTopic> list() {
        return contentTopicRepository.findAll();
    }
}

