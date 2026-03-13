package com.quizbyte.repository;

import com.quizbyte.model.StudyNote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyNoteRepository extends JpaRepository<StudyNote, Long> {
}

