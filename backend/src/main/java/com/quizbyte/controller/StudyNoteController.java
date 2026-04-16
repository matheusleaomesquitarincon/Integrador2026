package com.quizbyte.controller;

import com.quizbyte.messaging.StudyNoteMessagePublisher;
import com.quizbyte.model.StudyNote;
import com.quizbyte.repository.StudyNoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
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
    public List<StudyNote> list() {
        return studyNoteRepository.findAll();
    }

    @PostMapping
    public StudyNote create(@NonNull @Valid @RequestBody StudyNote note) {
        StudyNote saved = studyNoteRepository.save(note);
        studyNoteMessagePublisher.publishCreated(saved);
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyNote> update(@NonNull @PathVariable("id") Long id, @NonNull @Valid @RequestBody StudyNote updated) {
        if (!studyNoteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        return ResponseEntity.ok(studyNoteRepository.save(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@NonNull @PathVariable("id") Long id) {
        if (!studyNoteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        studyNoteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

