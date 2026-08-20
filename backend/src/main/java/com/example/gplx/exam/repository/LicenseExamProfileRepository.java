package com.example.gplx.exam.repository;

import com.example.gplx.exam.entity.LicenseExamProfile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicenseExamProfileRepository extends JpaRepository<LicenseExamProfile, Long> {

    Optional<LicenseExamProfile> findByProfileCodeAndIsActiveTrue(String profileCode);

    Optional<LicenseExamProfile> findByQuestionBankVersion_IdAndProfileCodeAndIsActiveTrue(Long questionBankVersionId, String profileCode);

    List<LicenseExamProfile> findByQuestionBankVersion_IdAndIsActiveTrueOrderByIdAsc(Long questionBankVersionId);
}
