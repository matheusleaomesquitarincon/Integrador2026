package com.quizbyte.community;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class CommunityEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(CommunityEventPublisher.class);

    public static final String GLOBAL_TOPIC = "/topic/community";
    public static final String QUESTION_TOPIC_PREFIX = "/topic/community/question/";

    private final SimpMessagingTemplate messagingTemplate;

    public CommunityEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(CommunityEvent event) {
        try {
            messagingTemplate.convertAndSend(GLOBAL_TOPIC, event);
            if (event.getQuestionId() != null) {
                messagingTemplate.convertAndSend(QUESTION_TOPIC_PREFIX + event.getQuestionId(), event);
            }
        } catch (MessagingException e) {
            log.warn("Falha ao publicar evento da comunidade {}: {}", event.getType(), e.getMessage());
        }
    }
}
