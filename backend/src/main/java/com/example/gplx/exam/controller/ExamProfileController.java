package com.example.gplx.exam.controller;

import com.example.gplx.exam.dto.response.ExamProfileResponse;
import com.example.gplx.exam.service.ExamService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/exam-profiles")
@RequiredArgsConstructor
public class ExamProfileController {

    private final ExamService examService;

    @GetMapping
    public List<ExamProfileResponse> getExamProfiles() {
        return examService.getActiveProfiles();
    }
}
