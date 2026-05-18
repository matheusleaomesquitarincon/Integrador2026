package com.quizbyte.community;

import com.quizbyte.auth.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/questions")
    public List<QuestionDto> listQuestions(@RequestParam(value = "topic", required = false) String topic,
                                           @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.listQuestions(topic, principal.getUser());
    }

    @GetMapping("/questions/{id}")
    public QuestionDto getQuestion(@NonNull @PathVariable("id") Long id,
                                   @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.getQuestion(id, principal.getUser());
    }

    @PostMapping("/questions")
    public QuestionDto createQuestion(@NonNull @Valid @RequestBody QuestionRequest request,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.createQuestion(request, principal.getUser());
    }

    @PutMapping("/questions/{id}")
    public QuestionDto updateQuestion(@NonNull @PathVariable("id") Long id,
                                      @NonNull @Valid @RequestBody QuestionRequest request,
                                      @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.updateQuestion(id, request, principal.getUser());
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@NonNull @PathVariable("id") Long id,
                                               @AuthenticationPrincipal UserPrincipal principal) {
        communityService.deleteQuestion(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/questions/{id}/like")
    public QuestionDto likeQuestion(@NonNull @PathVariable("id") Long id,
                                    @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.toggleQuestionLike(id, principal.getUser());
    }

    @GetMapping("/questions/{id}/answers")
    public List<AnswerDto> listAnswers(@NonNull @PathVariable("id") Long id,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.listAnswers(id, principal.getUser());
    }

    @PostMapping("/questions/{id}/answers")
    public AnswerDto createAnswer(@NonNull @PathVariable("id") Long id,
                                  @NonNull @Valid @RequestBody AnswerRequest request,
                                  @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.createAnswer(id, request, principal.getUser());
    }

    @PutMapping("/answers/{id}")
    public AnswerDto updateAnswer(@NonNull @PathVariable("id") Long id,
                                  @NonNull @Valid @RequestBody AnswerRequest request,
                                  @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.updateAnswer(id, request, principal.getUser());
    }

    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> deleteAnswer(@NonNull @PathVariable("id") Long id,
                                             @AuthenticationPrincipal UserPrincipal principal) {
        communityService.deleteAnswer(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/answers/{id}/like")
    public AnswerDto likeAnswer(@NonNull @PathVariable("id") Long id,
                                @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.toggleAnswerLike(id, principal.getUser());
    }

    @PostMapping("/answers/{id}/accept")
    public AnswerDto acceptAnswer(@NonNull @PathVariable("id") Long id,
                                  @AuthenticationPrincipal UserPrincipal principal) {
        return communityService.acceptAnswer(id, principal.getUser());
    }
}
