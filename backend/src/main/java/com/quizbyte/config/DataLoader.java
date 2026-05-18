package com.quizbyte.config;

import com.quizbyte.model.ContentTopic;
import com.quizbyte.model.Quiz;
import com.quizbyte.model.QuizQuestion;
import com.quizbyte.repository.ContentTopicRepository;
import com.quizbyte.repository.QuizQuestionRepository;
import com.quizbyte.repository.QuizRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ContentTopicRepository contentTopicRepository,
                                   QuizQuestionRepository quizQuestionRepository,
                                   QuizRepository quizRepository) {
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

            seedQuizzes(quizRepository, quizQuestionRepository);
        };
    }

    private void seedQuizzes(QuizRepository quizRepository,
                             QuizQuestionRepository questionRepository) {
        Quiz fundamentos = upsertQuiz(quizRepository, "fundamentos",
                "Fundamentos de Java",
                "Sintaxe, tipos, operadores e o básico para começar a programar em Java.",
                "code", 1);
        seedFundamentos(questionRepository, fundamentos);

        Quiz arrays = upsertQuiz(quizRepository, "arrays",
                "Arrays e Vetores",
                "Como declarar, percorrer e usar arrays uni e bidimensionais.",
                "layers", 2);
        seedArrays(questionRepository, arrays);

        Quiz colecoes = upsertQuiz(quizRepository, "colecoes",
                "Coleções (List, Set, Map)",
                "ArrayList, HashSet, HashMap: qual usar e quando.",
                "database", 3);
        seedColecoes(questionRepository, colecoes);

        Quiz poo = upsertQuiz(quizRepository, "poo",
                "Programação Orientada a Objetos",
                "Encapsulamento, herança, polimorfismo e abstração — os 4 pilares.",
                "book", 4);
        seedPoo(questionRepository, poo);

        Quiz spring = upsertQuiz(quizRepository, "springboot",
                "Spring Boot",
                "Anotações, injeção de dependências e controllers REST.",
                "server", 5);
        seedSpring(questionRepository, spring);
    }

    private void seedFundamentos(QuizQuestionRepository repo, Quiz quiz) {
        if (repo.countByQuiz(quiz) > 0) return;
        addQ(repo, quiz, 1, "fundamentos",
                "Qual tipo numérico armazena inteiros de 64 bits em Java?",
                "int", "long", "short", "byte", "B",
                "long é um primitivo de 64 bits (-2^63 a 2^63-1). int tem 32 bits.");
        addQ(repo, quiz, 2, "fundamentos",
                "Como declarar uma constante que não pode ser reatribuída?",
                "const int X = 10;",
                "final int X = 10;",
                "static int X = 10;",
                "immutable int X = 10;",
                "B",
                "final marca variáveis que não podem ser reatribuídas após inicialização. const não existe na linguagem.");
        addQ(repo, quiz, 3, "fundamentos",
                "Qual é a forma correta de comparar o CONTEÚDO de duas Strings?",
                "s1 == s2",
                "s1.equals(s2)",
                "s1.compare(s2)",
                "s1 === s2",
                "B",
                "== compara referências (mesmo objeto). equals() compara o conteúdo. Usar == com Strings funciona às vezes pelo String pool, mas é uma armadilha.");
        addQ(repo, quiz, 4, "fundamentos",
                "O que System.out.println faz?",
                "Imprime sem quebra de linha",
                "Imprime e adiciona uma quebra de linha no fim",
                "Lê dados do teclado",
                "Compila o código",
                "B",
                "println = print line. Adiciona \\n após o texto. Use System.out.print se não quiser a quebra.");
        addQ(repo, quiz, 5, "fundamentos",
                "Qual o resultado de 7 / 2 quando os dois operandos são int?",
                "3.5",
                "3",
                "4",
                "Erro de compilação",
                "B",
                "Divisão entre dois int é divisão inteira: quociente truncado (3). Para obter 3.5, pelo menos um operando precisa ser double: 7.0 / 2.");
    }

    private void seedArrays(QuizQuestionRepository repo, Quiz quiz) {
        if (repo.countByQuiz(quiz) > 0) return;
        addQ(repo, quiz, 1, "arrays",
                "Qual é o índice do primeiro elemento de um array em Java?",
                "0", "1", "-1", "Depende do tipo",
                "A",
                "Arrays em Java são indexados a partir de 0. O último índice é length - 1.");
        addQ(repo, quiz, 2, "arrays",
                "Como obter o tamanho de um array chamado arr?",
                "arr.size()",
                "arr.length",
                "arr.length()",
                "sizeof(arr)",
                "B",
                "Em arrays, length é um ATRIBUTO (sem parênteses). Em String é o método length(). Em coleções (List, Set) é o método size().");
        addQ(repo, quiz, 3, "arrays",
                "Qual a forma correta de declarar e criar um array de int com 5 posições?",
                "int arr[5];",
                "int[] arr = new int[5];",
                "int arr = new int(5);",
                "array<int> arr = new array(5);",
                "B",
                "Sintaxe canônica: Tipo[] nome = new Tipo[tamanho]. Cada posição começa com valor padrão (0 para numéricos, false para boolean, null para referências).");
        addQ(repo, quiz, 4, "arrays",
                "O que acontece ao acessar arr[10] em um array de tamanho 5?",
                "Retorna 0",
                "Retorna null",
                "Lança ArrayIndexOutOfBoundsException",
                "O array cresce automaticamente",
                "C",
                "Arrays em Java têm tamanho fixo. Acessar fora dos limites lança ArrayIndexOutOfBoundsException em tempo de execução.");
        addQ(repo, quiz, 5, "arrays",
                "Como percorrer um array com for-each?",
                "for (int i : arr) { ... }",
                "foreach (int i in arr) { ... }",
                "for each (int i of arr) { ... }",
                "arr.forEach(i -> ...)",
                "A",
                "Sintaxe do for-each: for (Tipo variavel : colecao). Funciona em arrays e em qualquer Iterable. arr.forEach existe só em coleções, não em arrays primitivos.");
    }

    private void seedColecoes(QuizQuestionRepository repo, Quiz quiz) {
        if (repo.countByQuiz(quiz) > 0) return;
        addQ(repo, quiz, 1, "colecoes",
                "Qual coleção NÃO permite elementos duplicados?",
                "ArrayList",
                "LinkedList",
                "HashSet",
                "Stack",
                "C",
                "Set (HashSet, TreeSet, LinkedHashSet) é uma coleção de elementos únicos. Tentativas de adicionar duplicados são ignoradas (add retorna false).");
        addQ(repo, quiz, 2, "colecoes",
                "Para acesso aleatório por índice (get(i)) em uma lista, qual implementação é mais eficiente?",
                "ArrayList",
                "LinkedList",
                "HashSet",
                "TreeMap",
                "A",
                "ArrayList usa um array interno: get(i) é O(1). LinkedList precisa percorrer a lista: O(n). Use LinkedList apenas quando há muitas inserções/remoções no meio.");
        addQ(repo, quiz, 3, "colecoes",
                "Qual interface representa mapeamento chave → valor?",
                "List",
                "Set",
                "Map",
                "Queue",
                "C",
                "Map<K,V> é a interface base. Implementações comuns: HashMap (rápido, sem ordem), LinkedHashMap (ordem de inserção), TreeMap (ordem natural das chaves).");
        addQ(repo, quiz, 4, "colecoes",
                "Qual a complexidade média de HashMap.get(key)?",
                "O(1)",
                "O(log n)",
                "O(n)",
                "O(n log n)",
                "A",
                "HashMap usa função hash para encontrar o bucket. Na média é O(1). No pior caso (muitas colisões), Java 8+ degrada para O(log n) usando árvore balanceada no bucket.");
        addQ(repo, quiz, 5, "colecoes",
                "Como criar uma lista imutável com 3 strings em Java 9+?",
                "new ArrayList<>(Arrays.asList(\"a\", \"b\", \"c\"))",
                "List.of(\"a\", \"b\", \"c\")",
                "Collections.list(\"a\", \"b\", \"c\")",
                "ImmutableList.create(\"a\", \"b\", \"c\")",
                "B",
                "List.of(...) cria uma lista imutável em uma linha (desde Java 9). Tentar modificá-la lança UnsupportedOperationException.");
    }

    private void seedPoo(QuizQuestionRepository repo, Quiz quiz) {
        if (repo.countByQuiz(quiz) > 0) return;
        addQ(repo, quiz, 1, "poo",
                "Qual pilar da POO está relacionado a esconder os detalhes internos de uma classe?",
                "Herança",
                "Encapsulamento",
                "Polimorfismo",
                "Abstração",
                "B",
                "Encapsulamento = ocultar estado interno expondo apenas o necessário via getters/setters/métodos públicos. Em Java se usa private nos campos.");
        addQ(repo, quiz, 2, "poo",
                "Qual palavra-chave faz uma classe HERDAR de outra?",
                "implements",
                "extends",
                "inherits",
                "parent",
                "B",
                "extends é usado para herança entre classes (subclasse extends superclasse). implements é usado para implementar interfaces.");
        addQ(repo, quiz, 3, "poo",
                "O que melhor descreve polimorfismo?",
                "Uma classe pode ter vários construtores",
                "Mesma interface, comportamentos diferentes em subclasses",
                "Uma classe pode herdar de várias classes",
                "Esconder atributos com private",
                "B",
                "Polimorfismo: o mesmo método pode se comportar de forma diferente conforme o tipo concreto do objeto em tempo de execução (late binding via overriding).");
        addQ(repo, quiz, 4, "poo",
                "Quando preferir uma classe ABSTRATA em vez de uma interface?",
                "Quando quiser compartilhar código entre subclasses",
                "Sempre que possível, é melhor que interface",
                "Quando a hierarquia tiver mais de 3 níveis",
                "Quando não souber o que fazer",
                "A",
                "Classe abstrata pode ter campos + métodos com implementação. Interface (até Java 7) era só contrato; desde Java 8 tem default methods mas ainda não tem estado. Use abstrata pra compartilhar código, interface pra definir contrato.");
        addQ(repo, quiz, 5, "poo",
                "Qual modificador permite acesso apenas dentro do MESMO PACOTE (sem subclasses fora dele)?",
                "private",
                "public",
                "protected",
                "(sem modificador / package-private)",
                "D",
                "Sem modificador, o acesso é package-private: visível apenas dentro do mesmo pacote. protected adiciona visibilidade às subclasses, mesmo em pacotes diferentes.");
    }

    private void seedSpring(QuizQuestionRepository repo, Quiz quiz) {
        if (repo.countByQuiz(quiz) > 0) return;
        addQ(repo, quiz, 1, "springboot",
                "Qual anotação marca uma classe como CONTROLADOR REST?",
                "@Controller",
                "@RestController",
                "@Service",
                "@Component",
                "B",
                "@RestController combina @Controller + @ResponseBody: cada método retorna direto o corpo da resposta (JSON), sem precisar repetir @ResponseBody em cada método.");
        addQ(repo, quiz, 2, "springboot",
                "Qual a forma RECOMENDADA de injetar dependências em uma classe Spring?",
                "Pelo construtor (sem precisar de @Autowired)",
                "Em campos com @Autowired",
                "Em setters com @Autowired",
                "Usando new diretamente",
                "A",
                "Injeção por construtor é a recomendação oficial: deixa as dependências explícitas, permite final, facilita testes. Spring 4.3+ dispensa @Autowired quando há só um construtor.");
        addQ(repo, quiz, 3, "springboot",
                "Como mapear um endpoint GET /api/users?",
                "@PostMapping(\"/api/users\")",
                "@GetMapping(\"/api/users\")",
                "@RequestMapping(\"/api/users\")",
                "@Endpoint(method=\"GET\", path=\"/api/users\")",
                "B",
                "@GetMapping é um atalho para @RequestMapping(method = RequestMethod.GET). Existem equivalentes para POST, PUT, DELETE e PATCH.");
        addQ(repo, quiz, 4, "springboot",
                "Onde fica a configuração padrão de uma aplicação Spring Boot?",
                "src/main/java/config.json",
                "src/main/resources/application.properties (ou .yml)",
                "pom.xml",
                "WEB-INF/web.xml",
                "B",
                "Spring Boot lê application.properties (ou application.yml) de src/main/resources automaticamente. Pode-se ter variações por profile: application-dev.properties, application-prod.properties.");
        addQ(repo, quiz, 5, "springboot",
                "O que faz a anotação @Service?",
                "Marca um endpoint REST",
                "Registra a classe como bean da camada de serviço gerenciado pelo Spring",
                "Cria um banco de dados embutido",
                "Inicia o servidor web",
                "B",
                "@Service é uma especialização de @Component. Marca a classe como bean da camada de lógica de negócios. Funcionalmente igual a @Component, mas comunica a intenção arquitetural.");
    }

    private Quiz upsertQuiz(QuizRepository repo, String slug, String title,
                            String description, String icon, int orderIndex) {
        return repo.findBySlug(slug).orElseGet(() -> {
            Quiz q = new Quiz();
            q.setSlug(slug);
            q.setTitle(title);
            q.setDescription(description);
            q.setIcon(icon);
            q.setOrderIndex(orderIndex);
            return repo.save(q);
        });
    }

    private void addQ(QuizQuestionRepository repo, Quiz quiz, int order, String topic,
                      String text, String a, String b, String c, String d,
                      String correct, String explanation) {
        QuizQuestion q = new QuizQuestion();
        q.setQuiz(quiz);
        q.setOrderIndex(order);
        q.setTopic(topic);
        q.setQuestionText(text);
        q.setOptionA(a);
        q.setOptionB(b);
        q.setOptionC(c);
        q.setOptionD(d);
        q.setCorrectOption(correct);
        q.setExplanation(explanation);
        repo.save(q);
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
