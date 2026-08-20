package com.example.gplx.chapter.mapper;

import com.example.gplx.chapter.dto.response.ChapterResponse;
import com.example.gplx.chapter.entity.Chapter;
import org.springframework.stereotype.Component;

@Component
public class ChapterMapper {

    public ChapterResponse toResponse(Chapter chapter) {
        return new ChapterResponse(
                chapter.getId(),
                chapter.getCode(),
                chapter.getName(),
                chapter.getDescription(),
                chapter.getSortOrder()
        );
    }
}
