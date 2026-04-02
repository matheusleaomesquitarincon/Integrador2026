package com.quizbyte.messaging;

import com.quizbyte.config.RabbitMQConfig;
import com.quizbyte.model.StudyNote;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class StudyNoteMessagePublisher {

    private final RabbitTemplate rabbitTemplate;

    public StudyNoteMessagePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishCreated(StudyNote note) {
        StudyNoteCreatedMessage message = new StudyNoteCreatedMessage(note.getId(), note.getTitle());
        rabbitTemplate.convertAndSend(RabbitMQConfig.STUDY_NOTE_QUEUE, message);
    }
}
