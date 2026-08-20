package com.example.gplx.seed.mapper;

import com.example.gplx.animation.entity.ExplanationAnimation;
import com.example.gplx.chapter.entity.Chapter;
import com.example.gplx.question.entity.Answer;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.entity.QuestionBankVersion;
import com.example.gplx.question.entity.QuestionType;
import com.example.gplx.seed.dto.request.AnswerImportDto;
import com.example.gplx.seed.dto.request.AnimationImportDto;
import com.example.gplx.seed.dto.request.ChapterImportDto;
import com.example.gplx.seed.dto.request.QuestionImportDto;
import org.springframework.stereotype.Component;

@Component
public class SeedImportMapper {

    public Chapter toEntity(ChapterImportDto dto, QuestionBankVersion questionBankVersion) {
        Chapter chapter = new Chapter();
        chapter.setQuestionBankVersion(questionBankVersion);
        chapter.setCode(dto.code().trim());
        chapter.setName(dto.name().trim());
        chapter.setDescription(trimToNull(dto.description()));
        chapter.setSortOrder(dto.sortOrder());
        return chapter;
    }

    public Question toEntity(QuestionImportDto dto, QuestionBankVersion questionBankVersion, Chapter chapter, QuestionType questionType) {
        Question question = new Question();
        question.setQuestionBankVersion(questionBankVersion);
        question.setChapter(chapter);
        question.setQuestionNumber(dto.questionNumber());
        question.setContent(dto.content().trim());
        question.setImageUrl(trimToNull(dto.imageUrl()));
        question.setQuestionType(questionType);
        question.setExplanation(trimToNull(dto.explanation()));
        question.setIsCritical(Boolean.TRUE.equals(dto.isCritical()));
        question.setHasAnimation(Boolean.TRUE.equals(dto.hasAnimation()));
        return question;
    }

    public Answer toEntity(AnswerImportDto dto, Question question, int sortOrder) {
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setLabel(dto.label().trim());
        answer.setContent(dto.content().trim());
        answer.setIsCorrect(Boolean.TRUE.equals(dto.isCorrect()));
        answer.setSortOrder(sortOrder);
        return answer;
    }

    public ExplanationAnimation toEntity(AnimationImportDto dto, Question question) {
        ExplanationAnimation animation = new ExplanationAnimation();
        animation.setQuestion(question);
        animation.setSceneWidth(dto.sceneWidth());
        animation.setSceneHeight(dto.sceneHeight());
        animation.setBackgroundImageUrl(trimToNull(dto.backgroundImageUrl()));
        animation.setDurationMs(dto.durationMs());
        animation.setAnimationData(dto.animationData());
        return animation;
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}
