package com.example.gplx.explanationvideo.repository;

import com.example.gplx.explanationvideo.entity.QuestionExplanationVideo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionExplanationVideoRepository extends JpaRepository<QuestionExplanationVideo, Long> {

    Optional<QuestionExplanationVideo> findByQuestion_IdAndIsActiveTrue(Long questionId);

    Optional<QuestionExplanationVideo> findByQuestion_Id(Long questionId);

    @Query("SELECT v FROM QuestionExplanationVideo v JOIN FETCH v.question q ORDER BY q.questionNumber ASC")
    List<QuestionExplanationVideo> findAllWithQuestion();
}
