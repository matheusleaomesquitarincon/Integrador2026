package com.quizbyte.controller;

import com.quizbyte.dto.StudyNoteRequest;
import com.quizbyte.dto.StudyNoteResponse;
import com.quizbyte.mapper.StudyNoteMapper;
import com.quizbyte.service.StudyNoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
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
    public List<StudyNoteResponse> list() {
        return studyNoteService.listAll().stream()
                .map(StudyNoteMapper::toResponse)
                .toList();
    }

    @PostMapping
    public StudyNoteResponse create(@NonNull @Valid @RequestBody StudyNoteRequest request) {
        return StudyNoteMapper.toResponse(
                studyNoteService.create(StudyNoteMapper.toEntity(request))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyNoteResponse> update(
            @NonNull @PathVariable("id") Long id,
            @NonNull @Valid @RequestBody StudyNoteRequest request
    ) {
        return studyNoteService.update(id, StudyNoteMapper.toEntity(request))
                .map(StudyNoteMapper::toResponse)
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
