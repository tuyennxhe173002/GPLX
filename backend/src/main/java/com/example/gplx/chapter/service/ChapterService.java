package com.example.gplx.chapter.service;

import com.example.gplx.chapter.dto.response.ChapterResponse;
import java.util.List;

public interface ChapterService {

    List<ChapterResponse> getChapters();
}
