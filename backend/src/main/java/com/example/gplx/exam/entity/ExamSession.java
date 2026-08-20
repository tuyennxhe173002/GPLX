package com.example.gplx.exam.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "exam_sessions")
public class ExamSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "license_type", nullable = false, length = 20)
    private String licenseType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "license_exam_profile_id")
    private LicenseExamProfile licenseExamProfile;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer correctCount = 0;

    @Column(nullable = false)
    private Integer wrongCount = 0;

    @Column(nullable = false)
    private Integer criticalWrongCount = 0;

    @Column(name = "is_passed")
    private Boolean passed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExamSessionState state = ExamSessionState.CREATED;

    @Column(nullable = false)
    private Instant startedAt = Instant.now();

    private Instant expiresAt;

    private Instant finishedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
}
