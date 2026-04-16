package com.quizbyte.mapper;

import com.quizbyte.dto.StudyNoteRequest;
import com.quizbyte.dto.StudyNoteResponse;
import com.quizbyte.model.StudyNote;

public final class StudyNoteMapper {

    private StudyNoteMapper() {
    }

    public static StudyNote toEntity(StudyNoteRequest request) {
        StudyNote note = new StudyNote();
        note.setTitle(request.title());
        note.setText(request.text());
        return note;
    }

    public static StudyNoteResponse toResponse(StudyNote entity) {
        return new StudyNoteResponse(entity.getId(), entity.getTitle(), entity.getText());
    }
}
