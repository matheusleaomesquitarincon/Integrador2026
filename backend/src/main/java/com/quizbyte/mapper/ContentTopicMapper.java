package com.quizbyte.mapper;

import com.quizbyte.dto.ContentTopicResponse;
import com.quizbyte.model.ContentTopic;

public final class ContentTopicMapper {

    private ContentTopicMapper() {
    }

    public static ContentTopicResponse toResponse(ContentTopic entity) {
        return new ContentTopicResponse(
                entity.getId(),
                entity.getSlug(),
                entity.getTitle(),
                entity.getDescription()
        );
    }
}
