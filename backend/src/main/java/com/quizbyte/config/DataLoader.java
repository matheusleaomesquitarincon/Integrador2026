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
            upsertTopic(contentTopicRepository, "arrays", "Arrays em Java",
                    "Introdução a arrays, como declarar, inicializar e percorrer.");
            upsertTopic(contentTopicRepository, "vetores", "Vetores",
                    "Vetores em Java (arrays unidimensionais) e boas práticas.");
            upsertTopic(contentTopicRepository, "matrizes", "Matrizes",
                    "Matrizes (arrays bidimensionais) para representar tabelas.");
            upsertTopic(contentTopicRepository, "tabelas-hash", "Tabela Hash",
                    "Uso de HashMap e outras estruturas baseadas em hash.");
            upsertTopic(contentTopicRepository, "poo", "Programação Orientada a Objetos",
                    "Abstração, encapsulamento, herança e polimorfismo em Java.");
            upsertTopic(contentTopicRepository, "springboot", "Spring Boot",
                    "Criação de APIs REST com Spring Boot.");

            // Trilha: Fundamentos & Lógica
            upsertTopic(contentTopicRepository, "algoritmos", "Algoritmos e Pseudocódigo",
                    "Pensar em passos antes de escrever código. Fluxograma e pseudocódigo.");
            upsertTopic(contentTopicRepository, "variaveis-tipos", "Variáveis e Tipos",
                    "Conceitos básicos de variáveis, tipos primitivos e declaração em Java.");
            upsertTopic(contentTopicRepository, "operadores", "Operadores",
                    "Aritméticos, relacionais, lógicos e atribuição. Precedência.");
            upsertTopic(contentTopicRepository, "strings", "Manipulação de Strings",
                    "Métodos da classe String: length, equals, substring, split, concatenação.");
            upsertTopic(contentTopicRepository, "entrada-saida", "Entrada e Saída",
                    "Ler do teclado com Scanner e imprimir com System.out.");
            upsertTopic(contentTopicRepository, "condicionais", "Estruturas Condicionais",
                    "if, else if, else, switch e operadores lógicos para tomar decisões.");
            upsertTopic(contentTopicRepository, "repeticao", "Estruturas de Repetição",
                    "for, while, do/while e for-each para executar código várias vezes.");
            upsertTopic(contentTopicRepository, "funcoes", "Funções",
                    "Métodos em Java: declaração, parâmetros, retorno e boas práticas.");
            upsertTopic(contentTopicRepository, "escopo", "Escopo de Variáveis",
                    "Onde uma variável vive: local, bloco, classe. Visibilidade e tempo de vida.");
            upsertTopic(contentTopicRepository, "recursao", "Recursão",
                    "Funções que chamam a si mesmas. Caso base, fatorial, Fibonacci.");
            upsertTopic(contentTopicRepository, "decomposicao", "Decomposição de Problemas",
                    "Quebrar problemas grandes em peças pequenas e testáveis. Mentalidade.");

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

    private void upsertTopic(ContentTopicRepository repo, String slug, String title, String description) {
        repo.findBySlug(slug).orElseGet(() -> {
            ContentTopic t = new ContentTopic();
            t.setSlug(slug);
            t.setTitle(title);
            t.setDescription(description);
            return repo.save(t);
        });
    }
}
