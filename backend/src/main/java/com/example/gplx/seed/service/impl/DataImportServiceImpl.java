package com.example.gplx.seed.service.impl;

import com.example.gplx.animation.repository.ExplanationAnimationRepository;
import com.example.gplx.chapter.entity.Chapter;
import com.example.gplx.chapter.repository.ChapterRepository;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.entity.QuestionBankVersion;
import com.example.gplx.question.entity.QuestionType;
import com.example.gplx.question.repository.AnswerRepository;
import com.example.gplx.question.repository.QuestionBankVersionRepository;
import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.seed.dto.request.AnimationImportDto;
import com.example.gplx.seed.dto.request.ChapterImportDto;
import com.example.gplx.seed.dto.request.QuestionBankManifestDto;
import com.example.gplx.seed.dto.request.QuestionImportDto;
import com.example.gplx.seed.mapper.SeedImportMapper;
import com.example.gplx.seed.service.DataImportService;
import com.example.gplx.seed.validation.QuestionBankValidationMode;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DataImportServiceImpl implements DataImportService {

    private final ObjectMapper objectMapper;
    private final ChapterRepository chapterRepository;
    private final QuestionRepository questionRepository;
    private final QuestionBankVersionRepository questionBankVersionRepository;
    private final AnswerRepository answerRepository;
    private final ExplanationAnimationRepository animationRepository;
    private final SeedImportMapper seedImportMapper;

    @Value("${app.seed.location:data}")
    private String seedLocation;

    @Value("${app.seed.validation-mode:PARTIAL}")
    private String validationMode;

    @Override
    @Transactional
    public void importData() {
        QuestionBankManifestDto manifest = readJson(seedLocation + "/manifest.json", new TypeReference<>() {});
        QuestionBankValidationMode mode = parseValidationMode(validationMode);

        List<ChapterImportDto> chapters = readJson(resolveSeedFile(manifest.chaptersFile(), "chapters.json"), new TypeReference<>() {});
        List<QuestionImportDto> questions = readJson(resolveSeedFile(manifest.questionsFile(), "questions.json"), new TypeReference<>() {});
        List<AnimationImportDto> animations = readJson(resolveSeedFile(manifest.animationsFile(), "animations.json"), new TypeReference<>() {});

        validateSourceData(manifest, chapters, questions, animations, mode);

        QuestionBankVersion questionBankVersion = resolveQuestionBankVersion(manifest);
        long currentQuestions = questionRepository.countByQuestionBankVersion_Id(questionBankVersion.getId());
        if (currentQuestions > 0) {
            Map<Integer, Question> questionByNumber = questionRepository.findByQuestionBankVersion_IdOrderByQuestionNumberAsc(questionBankVersion.getId())
                    .stream().collect(Collectors.toMap(Question::getQuestionNumber, q -> q));
            importAnimations(animations, questionByNumber);
            return;
        }

        Map<String, Chapter> chapterByCode = importChapters(chapters, questionBankVersion);
        Map<Integer, Question> questionByNumber = importQuestions(questions, questionBankVersion, chapterByCode);
        importAnimations(animations, questionByNumber);
        validateDatabaseState(manifest, questionBankVersion, mode);
    }

    private <T> T readJson(String path, TypeReference<T> typeReference) {
        ClassPathResource resource = new ClassPathResource(path);
        if (!resource.exists()) {
            throw new IllegalStateException("Missing seed file: " + path);
        }
        try (InputStream inputStream = resource.getInputStream()) {
            return objectMapper.readValue(inputStream, typeReference);
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to read seed file: " + path, exception);
        }
    }

    private String resolveSeedFile(String configuredFile, String defaultFile) {
        return seedLocation + "/" + (configuredFile == null || configuredFile.isBlank() ? defaultFile : configuredFile.trim());
    }

    private QuestionBankValidationMode parseValidationMode(String value) {
        try {
            return QuestionBankValidationMode.valueOf(value.trim().toUpperCase());
        } catch (Exception exception) {
            throw new IllegalStateException("Unsupported app.seed.validation-mode: " + value, exception);
        }
    }

    private void validateSourceData(
            QuestionBankManifestDto manifest,
            List<ChapterImportDto> chapters,
            List<QuestionImportDto> questions,
            List<AnimationImportDto> animations,
            QuestionBankValidationMode mode
    ) {
        validateManifest(manifest);
        if (chapters == null || chapters.isEmpty()) {
            throw new IllegalStateException("chapters file must contain at least one chapter");
        }
        if (questions == null || questions.isEmpty()) {
            throw new IllegalStateException("questions file must contain at least one question");
        }
        if (animations == null) {
            throw new IllegalStateException("animations file must contain an array, use [] when no animations are ready");
        }

        Set<String> chapterCodes = validateChapters(chapters);
        Map<Integer, AnimationImportDto> animationByQuestionNumber = validateAnimations(animations);
        validateQuestions(manifest, questions, chapterCodes, animationByQuestionNumber, mode);
        validateCriticalCount(manifest, questions, mode);
    }

    private void validateManifest(QuestionBankManifestDto manifest) {
        if (manifest == null) {
            throw new IllegalStateException("manifest.json is required");
        }
        requireNotBlank(manifest.bankCode(), "manifest bankCode is required");
        requireNotBlank(manifest.version(), "manifest version is required");
        requirePositive(manifest.questionCount(), "manifest questionCount must be positive");
        if (manifest.criticalQuestionCount() == null || manifest.criticalQuestionCount() < 0) {
            throw new IllegalStateException("manifest criticalQuestionCount must be non-negative");
        }
    }

    private void validateCriticalCount(QuestionBankManifestDto manifest, List<QuestionImportDto> questions, QuestionBankValidationMode mode) {
        int actualCriticalCount = (int) questions.stream().filter(question -> Boolean.TRUE.equals(question.isCritical())).count();
        if (mode == QuestionBankValidationMode.FULL && actualCriticalCount != manifest.criticalQuestionCount()) {
            throw new IllegalStateException("Critical question count mismatch. Expected " + manifest.criticalQuestionCount() + ", got " + actualCriticalCount);
        }
        if (mode == QuestionBankValidationMode.PARTIAL && actualCriticalCount > manifest.criticalQuestionCount()) {
            throw new IllegalStateException("Partial dataset cannot contain more critical questions than manifest declares");
        }
    }

    private Set<String> validateChapters(List<ChapterImportDto> chapters) {
        Set<String> chapterCodes = new HashSet<>();
        Set<Integer> sortOrders = new HashSet<>();
        for (ChapterImportDto chapter : chapters) {
            requireNotBlank(chapter.code(), "Chapter code is required");
            requireNotBlank(chapter.name(), "Chapter name is required for " + chapter.code());
            requirePositive(chapter.sortOrder(), "Chapter sortOrder must be positive for " + chapter.code());
            if (!chapterCodes.add(chapter.code())) {
                throw new IllegalStateException("Duplicate chapter code: " + chapter.code());
            }
            if (!sortOrders.add(chapter.sortOrder())) {
                throw new IllegalStateException("Duplicate chapter sortOrder: " + chapter.sortOrder());
            }
        }
        return chapterCodes;
    }

    private Map<Integer, AnimationImportDto> validateAnimations(List<AnimationImportDto> animations) {
        Map<Integer, AnimationImportDto> byQuestionNumber = new HashMap<>();
        for (AnimationImportDto animation : animations) {
            requireQuestionNumber(animation.questionNumber());
            requirePositive(animation.sceneWidth(), "Animation sceneWidth must be positive for question " + animation.questionNumber());
            requirePositive(animation.sceneHeight(), "Animation sceneHeight must be positive for question " + animation.questionNumber());
            requirePositive(animation.durationMs(), "Animation durationMs must be positive for question " + animation.questionNumber());
            if (animation.animationData() == null || !animation.animationData().isObject()) {
                throw new IllegalStateException("Animation data must be a JSON object for question " + animation.questionNumber());
            }
            if (byQuestionNumber.put(animation.questionNumber(), animation) != null) {
                throw new IllegalStateException("Duplicate animation for question " + animation.questionNumber());
            }
        }
        return byQuestionNumber;
    }

    private void validateQuestions(
            QuestionBankManifestDto manifest,
            List<QuestionImportDto> questions,
            Set<String> chapterCodes,
            Map<Integer, AnimationImportDto> animationByQuestionNumber,
            QuestionBankValidationMode mode
    ) {
        Set<Integer> questionNumbers = new HashSet<>();
        for (QuestionImportDto question : questions) {
            requireQuestionNumber(question.questionNumber());
            if (!questionNumbers.add(question.questionNumber())) {
                throw new IllegalStateException("Duplicate questionNumber: " + question.questionNumber());
            }
            requireNotBlank(question.chapterCode(), "chapterCode is required for question " + question.questionNumber());
            if (!chapterCodes.contains(question.chapterCode())) {
                throw new IllegalStateException("Unknown chapterCode " + question.chapterCode() + " for question " + question.questionNumber());
            }
            requireNotBlank(question.content(), "content is required for question " + question.questionNumber());
            parseQuestionType(question.questionType(), question.questionNumber());
            validateAnswers(question);
            if (Boolean.TRUE.equals(question.hasAnimation()) && !animationByQuestionNumber.containsKey(question.questionNumber())) {
                throw new IllegalStateException("Question " + question.questionNumber() + " hasAnimation=true but no animation exists");
            }
        }

        if (mode == QuestionBankValidationMode.FULL) {
            if (questions.size() != manifest.questionCount()) {
                throw new IllegalStateException("Question count mismatch. Expected " + manifest.questionCount() + ", got " + questions.size());
            }
            for (int number = 1; number <= manifest.questionCount(); number++) {
                if (!questionNumbers.contains(number)) {
                    throw new IllegalStateException("Missing questionNumber: " + number);
                }
            }
        } else if (questions.size() > manifest.questionCount()) {
            throw new IllegalStateException("Partial dataset cannot contain more questions than manifest declares");
        }
    }

    private void validateAnswers(QuestionImportDto question) {
        if (question.answers() == null || question.answers().size() < 2 || question.answers().size() > 4) {
            throw new IllegalStateException("Question " + question.questionNumber() + " must have 2 to 4 answers");
        }

        Set<String> labels = new HashSet<>();
        int correctCount = 0;
        for (var answer : question.answers()) {
            requireNotBlank(answer.label(), "Answer label is required for question " + question.questionNumber());
            requireNotBlank(answer.content(), "Answer content is required for question " + question.questionNumber() + ", label " + answer.label());
            if (!labels.add(answer.label())) {
                throw new IllegalStateException("Duplicate answer label " + answer.label() + " for question " + question.questionNumber());
            }
            if (Boolean.TRUE.equals(answer.isCorrect())) {
                correctCount++;
            }
        }
        if (correctCount != 1) {
            throw new IllegalStateException("Question " + question.questionNumber() + " must have exactly one correct answer, got " + correctCount);
        }
    }

    private QuestionBankVersion resolveQuestionBankVersion(QuestionBankManifestDto manifest) {
        return questionBankVersionRepository.findByBankCodeAndVersion(manifest.bankCode().trim(), manifest.version().trim())
                .orElseGet(() -> questionBankVersionRepository.save(toQuestionBankVersion(manifest)));
    }

    private QuestionBankVersion toQuestionBankVersion(QuestionBankManifestDto manifest) {
        QuestionBankVersion questionBankVersion = new QuestionBankVersion();
        questionBankVersion.setBankCode(manifest.bankCode().trim());
        questionBankVersion.setVersion(manifest.version().trim());
        questionBankVersion.setQuestionCount(manifest.questionCount());
        questionBankVersion.setCriticalQuestionCount(manifest.criticalQuestionCount());
        questionBankVersion.setSource(trimToNull(manifest.source()));
        questionBankVersion.setEffectiveFrom(manifest.effectiveFrom());
        questionBankVersion.setIsActive(true);
        return questionBankVersion;
    }

    private Map<String, Chapter> importChapters(List<ChapterImportDto> chapters, QuestionBankVersion questionBankVersion) {
        Map<String, Chapter> chapterByCode = new HashMap<>();
        for (ChapterImportDto dto : chapters) {
            Chapter saved = chapterRepository.save(seedImportMapper.toEntity(dto, questionBankVersion));
            chapterByCode.put(saved.getCode(), saved);
        }
        return chapterByCode;
    }

    private Map<Integer, Question> importQuestions(
            List<QuestionImportDto> questions,
            QuestionBankVersion questionBankVersion,
            Map<String, Chapter> chapterByCode
    ) {
        Map<Integer, Question> questionByNumber = new HashMap<>();
        for (QuestionImportDto dto : questions) {
            Question savedQuestion = questionRepository.save(seedImportMapper.toEntity(
                    dto,
                    questionBankVersion,
                    chapterByCode.get(dto.chapterCode()),
                    parseQuestionType(dto.questionType(), dto.questionNumber())
            ));

            int sortOrder = 1;
            for (var answerDto : dto.answers()) {
                answerRepository.save(seedImportMapper.toEntity(answerDto, savedQuestion, sortOrder++));
            }
            questionByNumber.put(savedQuestion.getQuestionNumber(), savedQuestion);
        }
        return questionByNumber;
    }

    private void importAnimations(List<AnimationImportDto> animations, Map<Integer, Question> questionByNumber) {
        for (AnimationImportDto dto : animations) {
            Question question = questionByNumber.get(dto.questionNumber());
            if (question == null) {
                throw new IllegalStateException("Animation references unknown questionNumber: " + dto.questionNumber());
            }
            com.example.gplx.animation.entity.ExplanationAnimation existing = animationRepository.findByQuestion_Id(question.getId()).orElse(null);
            if (existing != null) {
                existing.setSceneWidth(dto.sceneWidth());
                existing.setSceneHeight(dto.sceneHeight());
                existing.setBackgroundImageUrl(trimToNull(dto.backgroundImageUrl()));
                existing.setDurationMs(dto.durationMs());
                existing.setAnimationData(dto.animationData());
                existing.setUpdatedAt(java.time.Instant.now());
                animationRepository.save(existing);
            } else {
                animationRepository.save(seedImportMapper.toEntity(dto, question));
            }
        }
    }

    private void validateDatabaseState(QuestionBankManifestDto manifest, QuestionBankVersion questionBankVersion, QuestionBankValidationMode mode) {
        long questionCount = questionRepository.countByQuestionBankVersion_Id(questionBankVersion.getId());
        if (mode == QuestionBankValidationMode.FULL && questionCount != manifest.questionCount()) {
            throw new IllegalStateException("Expected " + manifest.questionCount() + " questions in database for bank version, got " + questionCount);
        }
        if (mode == QuestionBankValidationMode.PARTIAL && questionCount <= 0) {
            throw new IllegalStateException("Partial import produced no questions");
        }
    }

    private QuestionType parseQuestionType(String questionType, Integer questionNumber) {
        requireNotBlank(questionType, "questionType is required for question " + questionNumber);
        try {
            return QuestionType.valueOf(questionType.trim());
        } catch (IllegalArgumentException exception) {
            String validTypes = java.util.Arrays.stream(QuestionType.values())
                    .map(Objects::toString)
                    .collect(Collectors.joining(", "));
            throw new IllegalStateException("Invalid questionType " + questionType + " for question " + questionNumber + ". Valid values: " + validTypes);
        }
    }

    private void requireQuestionNumber(Integer questionNumber) {
        if (questionNumber == null || questionNumber < 1) {
            throw new IllegalStateException("questionNumber must be positive, got " + questionNumber);
        }
    }

    private void requirePositive(Integer value, String message) {
        if (value == null || value <= 0) {
            throw new IllegalStateException(message);
        }
    }

    private void requireNotBlank(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalStateException(message);
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }
}
