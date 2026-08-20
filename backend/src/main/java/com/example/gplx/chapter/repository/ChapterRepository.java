package com.example.gplx.chapter.repository;

import com.example.gplx.chapter.entity.Chapter;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    List<Chapter> findAllByOrderBySortOrderAsc();

    List<Chapter> findByQuestionBankVersion_IdOrderBySortOrderAsc(Long questionBankVersionId);

    Optional<Chapter> findByCode(String code);

    boolean existsByCode(String code);
}
