package com.quizbyte.controller;

import com.quizbyte.model.StudyNote;
import com.quizbyte.service.StudyNoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class StudyNoteController {

    private final StudyNoteService studyNoteService;

    public StudyNoteController(StudyNoteService studyNoteService) {
        this.studyNoteService = studyNoteService;
    }

    @GetMapping
    public List<StudyNote> list() {
        return studyNoteService.listAll();
    }

    @PostMapping
    @Transactional
    public StudyNote create(@NonNull @Valid @RequestBody StudyNote note) {
        return studyNoteService.create(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyNote> update(@NonNull @PathVariable("id") Long id, @NonNull @Valid @RequestBody StudyNote updated) {
        return studyNoteService.update(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@NonNull @PathVariable("id") Long id) {
        if (!studyNoteService.delete(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
