package com.quizbyte.config;

import com.quizbyte.model.Answer;
import com.quizbyte.model.Question;
import com.quizbyte.model.User;
import com.quizbyte.repository.AnswerRepository;
import com.quizbyte.repository.QuestionRepository;
import com.quizbyte.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Component
@Order(20)
public class CommunitySeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, User> users = new HashMap<>();

    public CommunitySeeder(UserRepository userRepository,
                           QuestionRepository questionRepository,
                           AnswerRepository answerRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (questionRepository.count() > 0) {
            return;
        }

        ensureUser("ana_dev", "ana@quizbyte.dev");
        ensureUser("bruno_ti", "bruno@quizbyte.dev");
        ensureUser("carla.codes", "carla@quizbyte.dev");
        ensureUser("diego.j", "diego@quizbyte.dev");
        ensureUser("erika.m", "erika@quizbyte.dev");
        ensureUser("felipe_p", "felipe@quizbyte.dev");
        ensureUser("gabi.dev", "gabi@quizbyte.dev");
        ensureUser("henrique.s", "henrique@quizbyte.dev");

        seedArrays();
        seedVetores();
        seedMatrizes();
        seedHash();
        seedPoo();
        seedSpring();
        seedPortugol();
        seedOutros();
    }

    private void seedArrays() {
        Question q = createQuestion("ana_dev", "arrays",
                "Por que arr.length não tem parênteses, mas \"texto\".length() tem?",
                "Toda vez que eu pego o tamanho de um array eu escrevo arr.length() por costume e o compilador reclama. " +
                        "Já em String eu preciso dos parênteses. Existe uma razão pra isso ou é só inconsistência da linguagem?");
        createAnswer("bruno_ti", q, true,
                "Não é inconsistência, é proposital. Em arrays, `length` é um **campo público final**, não um método — " +
                        "o tamanho é fixado quando o array é criado e fica gravado direto no objeto. " +
                        "Já em `String`, `length()` é um método porque a classe é um objeto comum e o tamanho é calculado a partir do array interno de caracteres. " +
                        "Regra prática:\n" +
                        "- Array → `arr.length` (sem parênteses)\n" +
                        "- String → `s.length()`\n" +
                        "- Coleções (List, Set, Map) → `col.size()`");
        createAnswer("carla.codes", q, false,
                "Complementando: isso vem desde o Java 1.0, quando arrays foram modelados como objetos especiais da JVM. " +
                        "Mudar agora quebraria praticamente todo código Java existente.");
    }

    private void seedVetores() {
        Question q = createQuestion("diego.j", "vetores",
                "Qual a diferença prática entre int[] e ArrayList<Integer>?",
                "Tô estudando para a prova e fiquei confuso. Em qual situação eu uso um e em qual eu uso o outro? " +
                        "O professor disse que ArrayList é mais flexível, mas não entendi por quê.");
        createAnswer("ana_dev", q, true,
                "As diferenças principais são:\n\n" +
                        "1. **Tamanho** — `int[]` tem tamanho fixo definido na criação. `ArrayList` cresce sozinho quando você dá `add`.\n" +
                        "2. **Tipo** — array aceita primitivos (`int`, `double`). `ArrayList` só aceita objetos (`Integer`, `Double`), com autoboxing.\n" +
                        "3. **API** — array só tem `length` e indexação `arr[i]`. `ArrayList` tem `add`, `remove`, `contains`, `indexOf`, `size`, etc.\n" +
                        "4. **Performance** — array é mais rápido e gasta menos memória (sem overhead de objeto Integer).\n\n" +
                        "Use `int[]` quando o tamanho é conhecido e performance importa (ex: processamento numérico). " +
                        "Use `ArrayList` quando você não sabe quantos elementos vai ter ou precisa adicionar/remover dinamicamente.");
        createAnswer("felipe_p", q, false,
                "Pequena dica de armadilha: `new ArrayList<Integer>()` ocupa bem mais memória que `new int[n]` por causa do boxing. " +
                        "Em listas grandes (milhões de números) isso faz diferença real. Olha `IntStream` ou bibliotecas tipo Eclipse Collections se precisar de performance.");
    }

    private void seedMatrizes() {
        Question q = createQuestion("erika.m", "matrizes",
                "Como descobrir o número de linhas e colunas de uma matriz int[][]?",
                "Recebi uma matriz como parâmetro do método e preciso descobrir a quantidade de linhas e de colunas. " +
                        "Tentei `matriz.length` mas só retorna um número — esse é o de linhas ou de colunas?");
        createAnswer("henrique.s", q, true,
                "Em Java, `int[][]` é na verdade um **array de arrays**. Então:\n\n" +
                        "```java\n" +
                        "int linhas = matriz.length;          // quantos arrays internos existem\n" +
                        "int colunas = matriz[0].length;      // tamanho do primeiro array interno\n" +
                        "```\n\n" +
                        "Cuidado: se a matriz for **irregular** (cada linha com tamanho diferente, chamada *jagged array*), " +
                        "`matriz[0].length` só serve para a primeira linha. Nesse caso percorre cada linha:\n\n" +
                        "```java\n" +
                        "for (int i = 0; i < matriz.length; i++) {\n" +
                        "    for (int j = 0; j < matriz[i].length; j++) {\n" +
                        "        System.out.print(matriz[i][j] + \" \");\n" +
                        "    }\n" +
                        "    System.out.println();\n" +
                        "}\n" +
                        "```");
        createAnswer("gabi.dev", q, false,
                "Só lembra de checar `matriz != null && matriz.length > 0` antes de fazer `matriz[0].length`, " +
                        "senão toma `NullPointerException` ou `ArrayIndexOutOfBoundsException`.");
    }

    private void seedHash() {
        Question q = createQuestion("felipe_p", "tabelas-hash",
                "Criei uma classe Aluno e usei como chave do HashMap, mas o get sempre retorna null. O que tá errado?",
                "Tenho mais ou menos isso:\n\n" +
                        "```java\n" +
                        "Map<Aluno, Nota> notas = new HashMap<>();\n" +
                        "notas.put(new Aluno(\"123\", \"Maria\"), new Nota(8.5));\n" +
                        "Nota n = notas.get(new Aluno(\"123\", \"Maria\")); // retorna null!\n" +
                        "```\n\n" +
                        "Por que ele não encontra se os dados são iguais?");
        createAnswer("ana_dev", q, true,
                "Você precisa sobrescrever **`equals` e `hashCode`** na classe `Aluno`. " +
                        "Sem isso, o `HashMap` usa a implementação padrão de `Object`, que compara por **referência** — " +
                        "ou seja, dois `new Aluno(...)` diferentes nunca são iguais, mesmo com os mesmos dados.\n\n" +
                        "Regra de ouro: se você sobrescreve `equals`, **tem que** sobrescrever `hashCode` também, " +
                        "e os dois precisam ser consistentes (objetos iguais devem ter o mesmo hashCode).\n\n" +
                        "```java\n" +
                        "@Override\n" +
                        "public boolean equals(Object o) {\n" +
                        "    if (this == o) return true;\n" +
                        "    if (!(o instanceof Aluno)) return false;\n" +
                        "    Aluno other = (Aluno) o;\n" +
                        "    return Objects.equals(matricula, other.matricula);\n" +
                        "}\n\n" +
                        "@Override\n" +
                        "public int hashCode() {\n" +
                        "    return Objects.hash(matricula);\n" +
                        "}\n" +
                        "```\n\n" +
                        "Dica: a IDE (IntelliJ/Eclipse/VS Code) gera isso automaticamente — `Alt+Insert` no IntelliJ.");
        createAnswer("bruno_ti", q, false,
                "Outra opção, se você puder usar Java 16+: troca `class Aluno` por `record Aluno(String matricula, String nome) {}`. " +
                        "Record já implementa `equals`, `hashCode` e `toString` automaticamente baseado nos campos.");
    }

    private void seedPoo() {
        Question q1 = createQuestion("gabi.dev", "poo",
                "Quando usar interface e quando usar classe abstrata?",
                "Eu sei que dá pra fazer mais ou menos a mesma coisa com as duas, mas qual é o critério real pra escolher? " +
                        "Tenho uma hierarquia `Funcionario → Gerente, Vendedor, Estagiario` e tô em dúvida.");
        createAnswer("henrique.s", q1, true,
                "Regra mental que funciona bem na prática:\n\n" +
                        "- **Classe abstrata** quando há **código compartilhado** entre as subclasses (campos, métodos com implementação) " +
                        "e a relação é \"é um\" (Gerente *é um* Funcionário).\n" +
                        "- **Interface** quando você quer descrever uma **capacidade** que classes não relacionadas podem ter " +
                        "(`Comparable`, `Runnable`, `Serializable`). A relação é \"pode fazer X\".\n\n" +
                        "No seu caso: `Funcionario` como classe abstrata (com `nome`, `salario`, `calcularSalario()`) faz sentido — " +
                        "tem estado e comportamento compartilhado. Se depois aparecer algo ortogonal como `EmiteRelatorio`, " +
                        "aí sim faria como interface.\n\n" +
                        "Lembra também:\n" +
                        "- Uma classe **só pode herdar de uma** classe abstrata (herança simples).\n" +
                        "- Uma classe pode **implementar várias** interfaces.");
        createAnswer("erika.m", q1, false,
                "Desde o Java 8 a fronteira ficou mais borrada porque interface aceita `default methods`. " +
                        "Mas continua valendo: interface não tem **estado** (campos não-finais), classe abstrata tem.");

        Question q2 = createQuestion("bruno_ti", "poo",
                "Diferença entre sobrecarga (overload) e sobrescrita (override)?",
                "Caí numa pergunta de prova sobre isso e errei. Alguém consegue explicar de um jeito que não esqueça mais?");
        createAnswer("diego.j", q2, true,
                "**Overload (sobrecarga)** — mesma classe, mesmo nome de método, **assinaturas diferentes** (número ou tipo de parâmetros). " +
                        "É resolvido em **tempo de compilação**.\n\n" +
                        "```java\n" +
                        "class Calculadora {\n" +
                        "    int soma(int a, int b) { return a + b; }\n" +
                        "    double soma(double a, double b) { return a + b; }   // overload\n" +
                        "    int soma(int a, int b, int c) { return a + b + c; } // overload\n" +
                        "}\n" +
                        "```\n\n" +
                        "**Override (sobrescrita)** — subclasse redefine um método herdado da superclasse com a **mesma assinatura**. " +
                        "Resolvido em **tempo de execução** (polimorfismo).\n\n" +
                        "```java\n" +
                        "class Animal {\n" +
                        "    void som() { System.out.println(\"...\"); }\n" +
                        "}\n" +
                        "class Cachorro extends Animal {\n" +
                        "    @Override\n" +
                        "    void som() { System.out.println(\"Au au\"); }     // override\n" +
                        "}\n" +
                        "```\n\n" +
                        "Macete: **overload é horizontal** (na mesma classe), **override é vertical** (entre pai e filho). " +
                        "Sempre use `@Override` — o compilador te avisa se você errou a assinatura.");
    }

    private void seedSpring() {
        Question q1 = createQuestion("carla.codes", "springboot",
                "Qual a diferença entre @Component, @Service e @Repository?",
                "Vejo essas três anotações o tempo todo no projeto e na prática parece que fazem a mesma coisa. " +
                        "É só convenção ou tem diferença técnica?");
        createAnswer("ana_dev", q1, true,
                "Tecnicamente, `@Service` e `@Repository` são **especializações de `@Component`** — todas registram a classe como bean no contexto do Spring. " +
                        "A diferença prática é:\n\n" +
                        "- **`@Component`** — bean genérico, use quando não cabe nas outras categorias.\n" +
                        "- **`@Service`** — camada de **regra de negócio**. Hoje só comunica intenção, mas no futuro o Spring pode adicionar comportamento (validação, AOP).\n" +
                        "- **`@Repository`** — camada de **acesso a dados**. Tem um superpoder extra: traduz exceções específicas do JDBC/JPA para `DataAccessException` do Spring, " +
                        "padronizando o tratamento de erros de banco.\n\n" +
                        "Convenção típica em uma aplicação Spring Boot:\n" +
                        "```\n" +
                        "@RestController  → camada web\n" +
                        "    ↓\n" +
                        "@Service         → regra de negócio\n" +
                        "    ↓\n" +
                        "@Repository      → acesso a dados (geralmente herdando JpaRepository)\n" +
                        "```");
        createAnswer("felipe_p", q1, false,
                "Detalhe que pega muita gente: se você usa `JpaRepository`, não precisa colocar `@Repository` na interface — " +
                        "o Spring Data já registra como bean automaticamente.");

        Question q2 = createQuestion("diego.j", "springboot",
                "Como criar um endpoint POST que recebe JSON e retorna 201?",
                "Tô criando uma API e preciso de um endpoint que receba um JSON com `{ \"nome\": \"...\", \"email\": \"...\" }` " +
                        "e devolva o objeto criado com status 201. Como faz isso no Spring Boot?");
        createAnswer("gabi.dev", q2, true,
                "Você precisa de:\n\n" +
                        "1. Um **DTO** que representa o JSON de entrada.\n" +
                        "2. `@PostMapping` no controller.\n" +
                        "3. `@RequestBody` no parâmetro pra desserializar o JSON.\n" +
                        "4. `ResponseEntity` para devolver o status 201.\n\n" +
                        "```java\n" +
                        "public class UsuarioRequest {\n" +
                        "    @NotBlank private String nome;\n" +
                        "    @Email    private String email;\n" +
                        "    // getters/setters\n" +
                        "}\n\n" +
                        "@RestController\n" +
                        "@RequestMapping(\"/api/usuarios\")\n" +
                        "public class UsuarioController {\n\n" +
                        "    private final UsuarioService service;\n" +
                        "    public UsuarioController(UsuarioService service) { this.service = service; }\n\n" +
                        "    @PostMapping\n" +
                        "    public ResponseEntity<Usuario> criar(@Valid @RequestBody UsuarioRequest req) {\n" +
                        "        Usuario salvo = service.criar(req);\n" +
                        "        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);\n" +
                        "    }\n" +
                        "}\n" +
                        "```\n\n" +
                        "O `@Valid` ativa as anotações de validação (`@NotBlank`, `@Email`, etc.) — sem ele as anotações são ignoradas.");
    }

    private void seedPortugol() {
        Question q = createQuestion("erika.m", "portugol",
                "Como ler um número do teclado no Portugol Studio?",
                "Tô começando agora em algoritmos e preciso ler um número inteiro digitado pelo usuário. " +
                        "Vi alguns exemplos com `leia()` mas não entendi como declarar a variável antes.");
        createAnswer("ana_dev", q, true,
                "No Portugol você declara a variável dentro do bloco `var` e depois usa `leia()` passando ela como parâmetro:\n\n" +
                        "```\n" +
                        "programa {\n" +
                        "    funcao inicio() {\n" +
                        "        inteiro idade\n" +
                        "        escreva(\"Digite sua idade: \")\n" +
                        "        leia(idade)\n" +
                        "        escreva(\"Você tem \", idade, \" anos\")\n" +
                        "    }\n" +
                        "}\n" +
                        "```\n\n" +
                        "Diferente do Java (onde você usa `Scanner`), o Portugol já tem `leia` e `escreva` embutidos. " +
                        "Pra ler vários valores numa linha só, pode passar várias variáveis: `leia(a, b, c)`.");
        createAnswer("carla.codes", q, false,
                "Quando for migrar pra Java, o equivalente fica:\n\n" +
                        "```java\n" +
                        "Scanner sc = new Scanner(System.in);\n" +
                        "System.out.print(\"Digite sua idade: \");\n" +
                        "int idade = sc.nextInt();\n" +
                        "System.out.println(\"Você tem \" + idade + \" anos\");\n" +
                        "```");
    }

    private void seedOutros() {
        Question q = createQuestion("henrique.s", "outros",
                "Qual a diferença entre == e .equals() em Java?",
                "Sempre que comparo Strings com `==` às vezes funciona, às vezes não. Tô confuso. " +
                        "Alguém pode explicar quando usar cada um?");
        createAnswer("ana_dev", q, true,
                "- **`==`** compara **referências** — se as duas variáveis apontam pro mesmo objeto na memória.\n" +
                        "- **`.equals()`** compara **conteúdo** — depende da implementação na classe.\n\n" +
                        "Para tipos primitivos (`int`, `double`, `char`...) `==` compara valor mesmo, sem mistério.\n\n" +
                        "Para objetos, **sempre use `.equals()`** pra comparar conteúdo:\n\n" +
                        "```java\n" +
                        "String a = \"oi\";\n" +
                        "String b = \"oi\";\n" +
                        "String c = new String(\"oi\");\n\n" +
                        "a == b       // true (mesma referência por causa do String pool)\n" +
                        "a == c       // false (objetos diferentes)\n" +
                        "a.equals(c)  // true (mesmo conteúdo)\n" +
                        "```\n\n" +
                        "O `==` \"funcionar às vezes\" com String é por causa do **String pool**: literais iguais são reaproveitados. " +
                        "Mas confiar nisso é cilada — sempre `.equals()`.\n\n" +
                        "Bônus: para evitar `NullPointerException`, use `Objects.equals(a, b)` ou `\"oi\".equals(a)` " +
                        "(literal na frente, variável depois).");
        createAnswer("bruno_ti", q, false,
                "Se tu estiver usando enum, aí `==` é seguro e até recomendado — enum sempre tem instância única por valor.");
    }

    private void ensureUser(String username, String email) {
        User u = userRepository.findByUsername(username).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPasswordHash(passwordEncoder.encode("demo1234"));
            return userRepository.save(newUser);
        });
        users.put(username, u);
    }

    private Question createQuestion(String authorUsername, String topic, String title, String text) {
        Question q = new Question();
        q.setAuthor(users.get(authorUsername));
        q.setTopic(topic);
        q.setTitle(title);
        q.setText(text);
        return questionRepository.save(q);
    }

    private Answer createAnswer(String authorUsername, Question question, boolean accepted, String text) {
        Answer a = new Answer();
        a.setAuthor(users.get(authorUsername));
        a.setQuestion(question);
        a.setAccepted(accepted);
        a.setText(text);
        return answerRepository.save(a);
    }
}
