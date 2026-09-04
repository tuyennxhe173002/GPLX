package com.example.gplx.practice.repository;

import com.example.gplx.practice.entity.PracticeAttempt;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PracticeAttemptRepository extends JpaRepository<PracticeAttempt, Long> {

    @Query("SELECT pa FROM PracticeAttempt pa " +
           "JOIN FETCH pa.question q " +
           "JOIN FETCH pa.selectedAnswer a " +
           "WHERE pa.userId = :userId " +
           "ORDER BY pa.createdAt DESC LIMIT 50")
    List<PracticeAttempt> findTop50ByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
