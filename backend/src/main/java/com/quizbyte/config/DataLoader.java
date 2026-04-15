package com.quizbyte.config;

import com.quizbyte.model.ContentTopic;
import com.quizbyte.model.QuizQuestion;
import com.quizbyte.repository.ContentTopicRepository;
import com.quizbyte.repository.QuizQuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ContentTopicRepository contentTopicRepository,
                                   QuizQuestionRepository quizQuestionRepository) {
        return args -> {
            if (contentTopicRepository.count() == 0) {
                contentTopicRepository.save(createTopic("arrays", "Arrays em Java",
                        "Introdução a arrays, como declarar, inicializar e percorrer."));
                contentTopicRepository.save(createTopic("vetores", "Vetores",
                        "Vetores em Java (arrays unidimensionais) e boas práticas."));
                contentTopicRepository.save(createTopic("matrizes", "Matrizes",
                        "Matrizes (arrays bidimensionais) para representar tabelas."));
                contentTopicRepository.save(createTopic("tabelas-hash", "Tabela Hash",
                        "Uso de HashMap e outras estruturas baseadas em hash."));
                contentTopicRepository.save(createTopic("poo", "Programação Orientada a Objetos",
                        "Abstração, encapsulamento, herança e polimorfismo em Java."));
                contentTopicRepository.save(createTopic("springboot", "Spring Boot",
                        "Criação de APIs REST com Spring Boot."));
                contentTopicRepository.save(createTopic("portugol", "Portugol",
                        "Lógica de programação com pseudocódigo estilo Portugol."));
            }

            if (quizQuestionRepository.count() == 0) {
                QuizQuestion q1 = new QuizQuestion();
                q1.setTopic("arrays");
                q1.setQuestionText("Qual é o índice do primeiro elemento de um array em Java?");
                q1.setOptionA("0");
                q1.setOptionB("1");
                q1.setOptionC("-1");
                q1.setOptionD("Depende do tipo do array");
                q1.setCorrectOption("A");
                quizQuestionRepository.save(q1);

                QuizQuestion q2 = new QuizQuestion();
                q2.setTopic("poo");
                q2.setQuestionText("Qual pilar da POO está relacionado a esconder detalhes internos de uma classe?");
                q2.setOptionA("Herança");
                q2.setOptionB("Encapsulamento");
                q2.setOptionC("Polimorfismo");
                q2.setOptionD("Abstração");
                q2.setCorrectOption("B");
                quizQuestionRepository.save(q2);
            }
        };
    }

    private ContentTopic createTopic(String slug, String title, String description) {
        ContentTopic topic = new ContentTopic();
        topic.setSlug(slug);
        topic.setTitle(title);
        topic.setDescription(description);
        return topic;
    }
}