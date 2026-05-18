package com.quizbyte.controller;

import com.quizbyte.auth.UserPrincipal;
import com.quizbyte.messaging.StudyNoteMessagePublisher;
import com.quizbyte.model.StudyNote;
import com.quizbyte.repository.StudyNoteRepository;
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
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class StudyNoteController {

    private final StudyNoteRepository studyNoteRepository;
    private final StudyNoteMessagePublisher studyNoteMessagePublisher;

    public StudyNoteController(
            StudyNoteRepository studyNoteRepository,
            StudyNoteMessagePublisher studyNoteMessagePublisher
    ) {
        this.studyNoteRepository = studyNoteRepository;
        this.studyNoteMessagePublisher = studyNoteMessagePublisher;
    }

    @GetMapping
    public List<StudyNote> list(@AuthenticationPrincipal UserPrincipal principal) {
        return studyNoteRepository.findByOwnerOrderByCreatedAtDesc(principal.getUser());
    }

    @PostMapping
    public StudyNote create(@NonNull @Valid @RequestBody StudyNote note,
                            @AuthenticationPrincipal UserPrincipal principal) {
        note.setId(null);
        note.setOwner(principal.getUser());
        StudyNote saved = studyNoteRepository.save(note);
        studyNoteMessagePublisher.publishCreated(saved);
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyNote> update(@NonNull @PathVariable("id") Long id,
                                            @NonNull @Valid @RequestBody StudyNote updated,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        return studyNoteRepository.findByIdAndOwner(id, principal.getUser())
                .map(existing -> {
                    existing.setTitle(updated.getTitle());
                    existing.setText(updated.getText());
                    existing.setTopic(updated.getTopic());
                    return ResponseEntity.ok(studyNoteRepository.save(existing));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@NonNull @PathVariable("id") Long id,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        return studyNoteRepository.findByIdAndOwner(id, principal.getUser())
                .map(existing -> {
                    studyNoteRepository.delete(existing);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
