package com.example.gplx.question.repository;

import com.example.gplx.question.entity.Answer;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    long countByQuestionId(Long questionId);

    List<Answer> findByQuestion_IdAndIsCorrectTrueOrderBySortOrderAsc(Long questionId);

    @Query("""
            select answer
            from Answer answer
            where answer.question.id in :questionIds
            order by answer.question.id asc, answer.sortOrder asc
            """)
    List<Answer> findByQuestionIds(@Param("questionIds") Collection<Long> questionIds);
}
