package com.quizbyte.controller;

import com.quizbyte.auth.UserPrincipal;
import com.quizbyte.model.ContentProgress;
import com.quizbyte.repository.ContentProgressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
public class ContentProgressController {

    private final ContentProgressRepository repository;

    public ContentProgressController(ContentProgressRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<String> list(@AuthenticationPrincipal UserPrincipal principal) {
        return repository.findByUser(principal.getUser()).stream()
                .map(ContentProgress::getTopicSlug)
                .collect(Collectors.toList());
    }

    @PostMapping("/{slug}")
    public ResponseEntity<Void> mark(@PathVariable("slug") String slug,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        repository.findByUserAndTopicSlug(principal.getUser(), slug)
                .orElseGet(() -> {
                    ContentProgress cp = new ContentProgress();
                    cp.setUser(principal.getUser());
                    cp.setTopicSlug(slug);
                    return repository.save(cp);
                });
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{slug}")
    @Transactional
    public ResponseEntity<Void> unmark(@PathVariable("slug") String slug,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        repository.deleteByUserAndTopicSlug(principal.getUser(), slug);
        return ResponseEntity.noContent().build();
    }
}
