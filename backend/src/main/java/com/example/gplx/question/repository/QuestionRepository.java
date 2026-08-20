package com.example.gplx.question.repository;

import com.example.gplx.question.entity.Question;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findByQuestionNumber(Integer questionNumber);

    boolean existsByQuestionNumber(Integer questionNumber);

    long countByQuestionBankVersion_Id(Long questionBankVersionId);

    Page<Question> findByChapterId(Long chapterId, Pageable pageable);
    Page<Question> findByQuestionBankVersion_Id(Long questionBankVersionId, Pageable pageable);
    Page<Question> findByQuestionBankVersion_IdAndChapter_Id(Long questionBankVersionId, Long chapterId, Pageable pageable);
    Optional<Question> findByIdAndQuestionBankVersion_Id(Long id, Long questionBankVersionId);
    List<Question> findByIsCriticalTrueOrderByQuestionNumberAsc();
    List<Question> findByQuestionBankVersion_IdOrderByQuestionNumberAsc(Long questionBankVersionId);
    List<Question> findByQuestionBankVersion_IdAndIsCriticalTrueOrderByQuestionNumberAsc(Long questionBankVersionId);

    @Query("""
            select question
            from Question question
            where question.questionBankVersion.id = :questionBankVersionId
            order by function('RANDOM')
            """)
    List<Question> findRandomByQuestionBankVersionId(@Param("questionBankVersionId") Long questionBankVersionId, Pageable pageable);
}
