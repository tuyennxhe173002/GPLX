package com.example.gplx.progress.repository;

import com.example.gplx.progress.entity.UserQuestionProgress;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserQuestionProgressRepository extends JpaRepository<UserQuestionProgress, Long> {

    @EntityGraph(attributePaths = {"question", "question.chapter", "question.questionBankVersion"})
    List<UserQuestionProgress> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"question", "question.chapter", "question.questionBankVersion"})
    List<UserQuestionProgress> findByUserIdAndWrongAttemptsGreaterThan(Long userId, Integer wrongAttempts);

    Optional<UserQuestionProgress> findByUserIdAndQuestion_Id(Long userId, Long questionId);
}
