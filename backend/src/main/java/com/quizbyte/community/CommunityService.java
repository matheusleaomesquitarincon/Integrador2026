package com.quizbyte.community;

import com.quizbyte.model.Answer;
import com.quizbyte.model.AnswerLike;
import com.quizbyte.model.Question;
import com.quizbyte.model.QuestionLike;
import com.quizbyte.model.User;
import com.quizbyte.repository.AnswerLikeRepository;
import com.quizbyte.repository.AnswerRepository;
import com.quizbyte.repository.QuestionLikeRepository;
import com.quizbyte.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionLikeRepository questionLikeRepository;
    private final AnswerLikeRepository answerLikeRepository;
    private final CommunityEventPublisher eventPublisher;

    public CommunityService(QuestionRepository questionRepository,
                            AnswerRepository answerRepository,
                            QuestionLikeRepository questionLikeRepository,
                            AnswerLikeRepository answerLikeRepository,
                            CommunityEventPublisher eventPublisher) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.questionLikeRepository = questionLikeRepository;
        this.answerLikeRepository = answerLikeRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<QuestionDto> listQuestions(String topic, User viewer) {
        List<Question> questions = (topic == null || topic.isEmpty() || "all".equalsIgnoreCase(topic))
                ? questionRepository.findAllByOrderByCreatedAtDesc()
                : questionRepository.findByTopicOrderByCreatedAtDesc(topic);
        return questions.stream()
                .map(q -> toDto(q, viewer))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuestionDto getQuestion(Long id, User viewer) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada"));
        return toDto(q, viewer);
    }

    @Transactional(readOnly = true)
    public List<AnswerDto> listAnswers(Long questionId, User viewer) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada"));
        return answerRepository.findByQuestionOrderByCreatedAtAsc(q).stream()
                .map(a -> toAnswerDto(a, viewer))
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionDto createQuestion(QuestionRequest request, User author) {
        Question q = new Question();
        q.setTitle(request.getTitle().trim());
        q.setText(request.getText().trim());
        q.setTopic(request.getTopic().trim());
        q.setAuthor(author);
        Question saved = questionRepository.save(q);
        QuestionDto dto = toDto(saved, author);
        eventPublisher.publish(CommunityEvent.question(CommunityEvent.Type.QUESTION_CREATED, dto));
        return dto;
    }

    @Transactional
    public QuestionDto updateQuestion(Long id, QuestionRequest request, User user) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada"));
        ensureOwner(q.getAuthor(), user);
        q.setTitle(request.getTitle().trim());
        q.setText(request.getText().trim());
        q.setTopic(request.getTopic().trim());
        Question saved = questionRepository.save(q);
        QuestionDto dto = toDto(saved, user);
        eventPublisher.publish(CommunityEvent.question(CommunityEvent.Type.QUESTION_UPDATED, dto));
        return dto;
    }

    @Transactional
    public void deleteQuestion(Long id, User user) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada"));
        ensureOwner(q.getAuthor(), user);
        List<Answer> answers = answerRepository.findByQuestionOrderByCreatedAtAsc(q);
        for (Answer a : answers) {
            answerLikeRepository.findByAnswerAndUser(a, user);
        }
        answerRepository.deleteAll(answers);
        questionRepository.delete(q);
        eventPublisher.publish(CommunityEvent.questionDeleted(id));
    }

    @Transactional
    public QuestionDto toggleQuestionLike(Long id, User user) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada"));
        questionLikeRepository.findByQuestionAndUser(q, user)
                .ifPresentOrElse(
                        questionLikeRepository::delete,
                        () -> questionLikeRepository.save(new QuestionLike(q, user))
                );
        long count = questionLikeRepository.countByQuestion(q);
        eventPublisher.publish(CommunityEvent.questionLiked(id, count));
        return toDto(q, user);
    }

    @Transactional
    public AnswerDto createAnswer(Long questionId, AnswerRequest request, User author) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pergunta não encontrada"));
        Answer a = new Answer();
        a.setText(request.getText().trim());
        a.setQuestion(q);
        a.setAuthor(author);
        Answer saved = answerRepository.save(a);
        AnswerDto dto = toAnswerDto(saved, author);
        eventPublisher.publish(CommunityEvent.answer(CommunityEvent.Type.ANSWER_CREATED, dto));
        return dto;
    }

    @Transactional
    public AnswerDto updateAnswer(Long id, AnswerRequest request, User user) {
        Answer a = answerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta não encontrada"));
        ensureOwner(a.getAuthor(), user);
        a.setText(request.getText().trim());
        Answer saved = answerRepository.save(a);
        AnswerDto dto = toAnswerDto(saved, user);
        eventPublisher.publish(CommunityEvent.answer(CommunityEvent.Type.ANSWER_UPDATED, dto));
        return dto;
    }

    @Transactional
    public void deleteAnswer(Long id, User user) {
        Answer a = answerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta não encontrada"));
        ensureOwner(a.getAuthor(), user);
        Long questionId = a.getQuestion().getId();
        answerRepository.delete(a);
        eventPublisher.publish(CommunityEvent.answerDeleted(questionId, id));
    }

    @Transactional
    public AnswerDto toggleAnswerLike(Long id, User user) {
        Answer a = answerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta não encontrada"));
        answerLikeRepository.findByAnswerAndUser(a, user)
                .ifPresentOrElse(
                        answerLikeRepository::delete,
                        () -> answerLikeRepository.save(new AnswerLike(a, user))
                );
        long count = answerLikeRepository.countByAnswer(a);
        eventPublisher.publish(CommunityEvent.answerLiked(a.getQuestion().getId(), id, count));
        return toAnswerDto(a, user);
    }

    @Transactional
    public AnswerDto acceptAnswer(Long id, User user) {
        Answer a = answerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta não encontrada"));
        Question q = a.getQuestion();
        if (!Objects.equals(q.getAuthor().getId(), user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o autor da pergunta pode aceitar uma resposta");
        }
        boolean newState = !a.isAccepted();
        a.setAccepted(newState);
        Answer saved = answerRepository.save(a);
        if (newState) {
            answerRepository.unacceptOthers(q, saved.getId());
        }
        AnswerDto dto = toAnswerDto(saved, user);
        eventPublisher.publish(CommunityEvent.answer(CommunityEvent.Type.ANSWER_ACCEPTED, dto));
        return dto;
    }

    private QuestionDto toDto(Question q, User viewer) {
        long answerCount = answerRepository.countByQuestion(q);
        long likeCount = questionLikeRepository.countByQuestion(q);
        boolean likedByMe = viewer != null && questionLikeRepository.existsByQuestionAndUser(q, viewer);
        boolean hasAccepted = answerRepository.findByQuestionOrderByCreatedAtAsc(q).stream()
                .anyMatch(Answer::isAccepted);
        return QuestionDto.from(q, answerCount, likeCount, likedByMe, hasAccepted);
    }

    private AnswerDto toAnswerDto(Answer a, User viewer) {
        long likeCount = answerLikeRepository.countByAnswer(a);
        boolean likedByMe = viewer != null && answerLikeRepository.existsByAnswerAndUser(a, viewer);
        return AnswerDto.from(a, likeCount, likedByMe);
    }

    private void ensureOwner(User owner, User actor) {
        if (owner == null || actor == null || !Objects.equals(owner.getId(), actor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para essa ação");
        }
    }
}
