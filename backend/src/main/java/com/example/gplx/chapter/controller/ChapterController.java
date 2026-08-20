package com.example.gplx.chapter.controller;

import com.example.gplx.chapter.dto.response.ChapterResponse;
import com.example.gplx.chapter.service.ChapterService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chapters")
@RequiredArgsConstructor
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping
    public List<ChapterResponse> getChapters() {
        return chapterService.getChapters();
    }
}
