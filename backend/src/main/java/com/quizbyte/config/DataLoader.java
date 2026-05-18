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
            // Trilha: Java — Início
            upsertTopic(contentTopicRepository, "ambiente-java", "Configurando o Ambiente",
                    "Instalar JDK, escolher IDE (IntelliJ, VS Code, Eclipse) e rodar o primeiro programa.");
            upsertTopic(contentTopicRepository, "jvm-compilacao", "Compilação e JVM",
                    "Como Java compila pra bytecode e roda em qualquer SO via JVM. javac vs java, JRE vs JDK.");
            upsertTopic(contentTopicRepository, "sintaxe-java", "Sintaxe Java",
                    "Estrutura básica de um programa Java: classe, método main, comentários e convenções.");
            upsertTopic(contentTopicRepository, "primitivos-wrapper", "Primitivos vs Wrapper",
                    "Diferença entre int/Integer, double/Double, autoboxing e unboxing.");
            upsertTopic(contentTopicRepository, "pacotes-imports", "Pacotes e Imports",
                    "Organização de classes em pacotes, import, classpath e convenções.");
            upsertTopic(contentTopicRepository, "javadoc", "Documentação Javadoc",
                    "Comentários estruturados com /** */, tags @param, @return e geração de HTML.");

            upsertTopic(contentTopicRepository, "arrays", "Arrays em Java",
                    "Introdução a arrays, como declarar, inicializar e percorrer.");
            upsertTopic(contentTopicRepository, "vetores", "Vetores",
                    "Vetores em Java (arrays unidimensionais) e boas práticas.");
            upsertTopic(contentTopicRepository, "matrizes", "Matrizes",
                    "Matrizes (arrays bidimensionais) para representar tabelas.");
            upsertTopic(contentTopicRepository, "listas", "Listas Dinâmicas",
                    "ArrayList vs LinkedList. Quando usar cada, performance, métodos principais.");
            upsertTopic(contentTopicRepository, "sets", "Sets",
                    "HashSet, TreeSet, LinkedHashSet. Coleções sem duplicados.");
            upsertTopic(contentTopicRepository, "tabelas-hash", "Tabela Hash",
                    "Uso de HashMap e outras estruturas baseadas em hash.");
            upsertTopic(contentTopicRepository, "pilhas-filas", "Pilhas e Filas",
                    "Stack (LIFO), Queue (FIFO), Deque, PriorityQueue.");
            upsertTopic(contentTopicRepository, "iteradores", "Iteradores",
                    "Iterator, Iterable, for-each. Remoção segura durante iteração.");
            upsertTopic(contentTopicRepository, "comparator", "Comparator e Comparable",
                    "Ordenação customizada de objetos com Comparable e Comparator.");
            upsertTopic(contentTopicRepository, "imutaveis", "Coleções Imutáveis",
                    "List.of, Map.of, Collections.unmodifiableList. Boas práticas modernas.");
            upsertTopic(contentTopicRepository, "streams", "Stream API",
                    "Processamento funcional de coleções: filter, map, collect, reduce.");
            upsertTopic(contentTopicRepository, "encapsulamento", "Encapsulamento",
                    "Modificadores de acesso, getters/setters, ocultação de estado interno.");
            upsertTopic(contentTopicRepository, "heranca", "Herança",
                    "extends, super, hierarquia de classes, quando NÃO usar herança.");
            upsertTopic(contentTopicRepository, "polimorfismo", "Polimorfismo",
                    "Overriding, late binding, casting de objetos, instanceof.");
            upsertTopic(contentTopicRepository, "abstracao", "Abstração",
                    "Classes abstratas, interfaces, default methods, quando usar cada.");
            upsertTopic(contentTopicRepository, "spring-intro", "Introdução ao Spring Boot",
                    "O que é Spring Boot, Spring Initializr, primeiro projeto, @SpringBootApplication.");
            upsertTopic(contentTopicRepository, "spring-di", "Injeção de Dependências",
                    "IoC container, @Component, @Service, @Repository, @Autowired, constructor injection.");
            upsertTopic(contentTopicRepository, "spring-config", "Properties e Configuração",
                    "application.properties/yml, profiles dev/prod, @Value, @ConfigurationProperties.");
            upsertTopic(contentTopicRepository, "spring-beans", "Beans e Ciclo de Vida",
                    "@Bean, @Configuration, escopos singleton/prototype, @PostConstruct, @PreDestroy.");
            upsertTopic(contentTopicRepository, "spring-rest", "REST APIs",
                    "@RestController, @GetMapping/PostMapping, @PathVariable, @RequestBody, ResponseEntity.");
            upsertTopic(contentTopicRepository, "spring-validation", "Validação de Dados",
                    "@Valid, Bean Validation (@NotNull, @Email, @Size), mensagens customizadas.");
            upsertTopic(contentTopicRepository, "spring-exceptions", "Tratamento de Exceções",
                    "@ControllerAdvice, @ExceptionHandler, retorno JSON estruturado, status codes.");
            upsertTopic(contentTopicRepository, "spring-security", "Spring Security",
                    "Autenticação, autorização, configuração de rotas públicas/privadas, BCrypt.");
            upsertTopic(contentTopicRepository, "spring-jpa-entities", "Entidades JPA",
                    "@Entity, @Table, @Id, @GeneratedValue, relacionamentos @OneToMany e @ManyToOne.");
            upsertTopic(contentTopicRepository, "spring-data-jpa", "Spring Data JPA",
                    "JpaRepository, derived queries, @Query JPQL, paginação e ordenação.");

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
