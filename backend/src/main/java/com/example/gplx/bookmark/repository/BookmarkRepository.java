package com.example.gplx.bookmark.repository;

import com.example.gplx.bookmark.entity.Bookmark;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    @EntityGraph(attributePaths = {"question", "question.chapter", "question.questionBankVersion"})
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Bookmark> findByUserIdAndQuestion_Id(Long userId, Long questionId);

    boolean existsByUserIdAndQuestion_Id(Long userId, Long questionId);

    void deleteByUserIdAndQuestion_Id(Long userId, Long questionId);
}
