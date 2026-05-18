package com.quizbyte.repository;

import com.quizbyte.model.StudyNote;
import com.quizbyte.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyNoteRepository extends JpaRepository<StudyNote, Long> {

    List<StudyNote> findByOwnerOrderByCreatedAtDesc(User owner);

    Optional<StudyNote> findByIdAndOwner(Long id, User owner);
}
