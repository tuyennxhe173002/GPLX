package com.example.gplx.exam.repository;

import com.example.gplx.exam.entity.ExamSessionAnswer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamSessionAnswerRepository extends JpaRepository<ExamSessionAnswer, Long> {

    Optional<ExamSessionAnswer> findByExamSession_IdAndQuestion_Id(Long examSessionId, Long questionId);

    @EntityGraph(attributePaths = {"selectedAnswer", "question"})
    List<ExamSessionAnswer> findByExamSession_Id(Long examSessionId);
}
