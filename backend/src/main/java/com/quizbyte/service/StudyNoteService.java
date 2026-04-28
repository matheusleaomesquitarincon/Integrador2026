package com.quizbyte.service;

import com.quizbyte.messaging.StudyNoteMessagePublisher;
import com.quizbyte.model.StudyNote;
import com.quizbyte.repository.StudyNoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudyNoteService {

    private final StudyNoteRepository studyNoteRepository;
    private final StudyNoteMessagePublisher studyNoteMessagePublisher;

    public StudyNoteService(
            StudyNoteRepository studyNoteRepository,
            StudyNoteMessagePublisher studyNoteMessagePublisher
    ) {
        this.studyNoteRepository = studyNoteRepository;
        this.studyNoteMessagePublisher = studyNoteMessagePublisher;
    }

    public List<StudyNote> listAll() {
        return studyNoteRepository.findAll();
    }

    public StudyNote create(StudyNote note) {
        StudyNote saved = studyNoteRepository.save(note);
        studyNoteMessagePublisher.publishCreated(saved);
        return saved;
    }

    public Optional<StudyNote> update(Long id, StudyNote updated) {
        if (!studyNoteRepository.existsById(id)) {
            return Optional.empty();
        }
        updated.setId(id);
        return Optional.of(studyNoteRepository.save(updated));
    }

    public boolean delete(Long id) {
        if (!studyNoteRepository.existsById(id)) {
            return false;
        }
        studyNoteRepository.deleteById(id);
        return true;
    }
}
