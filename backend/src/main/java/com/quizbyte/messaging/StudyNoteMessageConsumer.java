package com.quizbyte.messaging;

import com.quizbyte.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class StudyNoteMessageConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(StudyNoteMessageConsumer.class);

    @RabbitListener(queues = RabbitMQConfig.STUDY_NOTE_QUEUE)
    public void handleStudyNoteCreated(StudyNoteCreatedMessage message) {
        LOGGER.info("Processing StudyNote in background - id: {}, title: {}", message.getId(), message.getTitle());
    }
}
