package com.quizbyte.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String STUDY_NOTE_QUEUE = "study-note-created.queue";

    @Bean
    public Queue studyNoteCreatedQueue() {
        return new Queue(STUDY_NOTE_QUEUE, true);
    }
}
