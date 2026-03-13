package com.quizbyte.controller;

import com.quizbyte.model.StudyNote;
import com.quizbyte.repository.StudyNoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class StudyNoteController {

    private final StudyNoteRepository studyNoteRepository;

    public StudyNoteController(StudyNoteRepository studyNoteRepository) {
        this.studyNoteRepository = studyNoteRepository;
    }

    @GetMapping
    public List<StudyNote> list() {
        return studyNoteRepository.findAll();
    }

    @PostMapping
    public StudyNote create(@Valid @RequestBody StudyNote note) {
        return studyNoteRepository.save(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyNote> update(@PathVariable Long id, @Valid @RequestBody StudyNote updated) {
        Optional<StudyNote> existing = studyNoteRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        return ResponseEntity.ok(studyNoteRepository.save(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!studyNoteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        studyNoteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

