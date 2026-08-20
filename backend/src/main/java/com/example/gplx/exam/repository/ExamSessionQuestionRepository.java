package com.example.gplx.exam.repository;

import com.example.gplx.exam.entity.ExamSessionQuestion;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamSessionQuestionRepository extends JpaRepository<ExamSessionQuestion, Long> {

    @EntityGraph(attributePaths = {"question", "question.chapter"})
    List<ExamSessionQuestion> findByExamSession_IdOrderBySortOrderAsc(Long examSessionId);
}
