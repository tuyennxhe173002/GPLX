package com.example.gplx.question.repository;

import com.example.gplx.question.entity.QuestionBankVersion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionBankVersionRepository extends JpaRepository<QuestionBankVersion, Long> {

    Optional<QuestionBankVersion> findByBankCodeAndVersion(String bankCode, String version);

    Optional<QuestionBankVersion> findFirstByIsActiveTrueOrderByIdAsc();
}
