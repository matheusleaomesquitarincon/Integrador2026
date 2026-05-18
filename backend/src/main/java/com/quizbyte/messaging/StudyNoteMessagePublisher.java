package com.quizbyte.messaging;

import com.quizbyte.config.RabbitMQConfig;
import com.quizbyte.model.StudyNote;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class StudyNoteMessagePublisher {

    private static final Logger log = LoggerFactory.getLogger(StudyNoteMessagePublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public StudyNoteMessagePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishCreated(StudyNote note) {
        StudyNoteCreatedMessage message = new StudyNoteCreatedMessage(note.getId(), note.getTitle());
        try {
            rabbitTemplate.convertAndSend(RabbitMQConfig.STUDY_NOTE_QUEUE, message);
        } catch (AmqpException e) {
            log.warn("RabbitMQ indisponível, mensagem da nota id={} não foi publicada: {}", note.getId(), e.getMessage());
        }
    }
}
