package com.example.gplx.exam.entity;

import com.example.gplx.question.entity.QuestionBankVersion;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "license_exam_profiles")
public class LicenseExamProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_bank_version_id", nullable = false)
    private QuestionBankVersion questionBankVersion;

    @Column(nullable = false, length = 50)
    private String profileCode;

    @Column(nullable = false, length = 100)
    private String displayName;

    @Column(nullable = false)
    private Integer questionCount;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(nullable = false)
    private Integer passingScore;

    @Column(nullable = false)
    private Boolean criticalFailEnabled;

    @Column(nullable = false)
    private Integer criticalQuestionCount;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
}
