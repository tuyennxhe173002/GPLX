package com.example.gplx.exam.repository;

import com.example.gplx.exam.entity.ExamSession;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {

    @EntityGraph(attributePaths = {"licenseExamProfile"})
    Optional<ExamSession> findById(Long id);

    @EntityGraph(attributePaths = {"licenseExamProfile"})
    List<ExamSession> findTop20ByUserIdOrderByStartedAtDesc(Long userId);
}
