package com.example.gplx.animation.repository;

import com.example.gplx.animation.entity.ExplanationAnimation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExplanationAnimationRepository extends JpaRepository<ExplanationAnimation, Long> {

    boolean existsByQuestionQuestionNumber(Integer questionNumber);

    Optional<ExplanationAnimation> findByQuestion_Id(Long questionId);
}
