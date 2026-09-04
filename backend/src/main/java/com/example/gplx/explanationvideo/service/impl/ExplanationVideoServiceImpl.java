package com.example.gplx.explanationvideo.service.impl;

import com.example.gplx.common.exception.ApiException;
import com.example.gplx.explanationvideo.dto.request.ExplanationVideoRequest;
import com.example.gplx.explanationvideo.dto.request.VideoPreviewRequest;
import com.example.gplx.explanationvideo.dto.response.ExplanationVideoResponse;
import com.example.gplx.explanationvideo.dto.response.VideoPreviewResponse;
import com.example.gplx.explanationvideo.entity.QuestionExplanationVideo;
import com.example.gplx.explanationvideo.provider.GoogleDriveLinkParser;
import com.example.gplx.explanationvideo.repository.QuestionExplanationVideoRepository;
import com.example.gplx.explanationvideo.service.ExplanationVideoService;
import com.example.gplx.question.entity.Question;
import com.example.gplx.question.repository.QuestionRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExplanationVideoServiceImpl implements ExplanationVideoService {

    private final QuestionExplanationVideoRepository videoRepository;
    private final QuestionRepository questionRepository;
    private final GoogleDriveLinkParser driveLinkParser;

    @Override
    @Transactional(readOnly = true)
    public ExplanationVideoResponse getVideoByQuestionId(Long questionId) {
        return videoRepository.findByQuestion_IdAndIsActiveTrue(questionId)
                .map(this::toResponse)
                .orElse(null);
    }

    @Override
    @Transactional
    public ExplanationVideoResponse saveOrUpdateVideo(Long questionId, ExplanationVideoRequest request, Long userId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> ApiException.notFound("Question not found"));

        String fileId = driveLinkParser.extractFileId(request.driveUrl());
        String embedUrl = driveLinkParser.generateEmbedUrl(fileId);

        QuestionExplanationVideo video = videoRepository.findByQuestion_Id(questionId)
                .orElseGet(QuestionExplanationVideo::new);

        boolean isNew = video.getId() == null;
        if (isNew) {
            video.setQuestion(question);
            video.setCreatedBy(userId);
            video.setCreatedAt(Instant.now());
        }

        video.setProvider("GOOGLE_DRIVE");
        video.setSourceUrl(request.driveUrl().trim());
        video.setExternalFileId(fileId);
        video.setEmbedUrl(embedUrl);
        video.setTitle(request.title() != null ? request.title().trim() : null);
        video.setIsActive(request.isActive() == null || Boolean.TRUE.equals(request.isActive()));
        video.setUpdatedBy(userId);
        video.setUpdatedAt(Instant.now());

        QuestionExplanationVideo saved = videoRepository.save(video);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteVideo(Long questionId) {
        QuestionExplanationVideo video = videoRepository.findByQuestion_Id(questionId)
                .orElseThrow(() -> ApiException.notFound("Explanation video not found for question"));
        videoRepository.delete(video);
    }

    @Override
    public VideoPreviewResponse previewVideo(VideoPreviewRequest request) {
        String fileId = driveLinkParser.extractFileId(request.driveUrl());
        String embedUrl = driveLinkParser.generateEmbedUrl(fileId);
        return new VideoPreviewResponse(fileId, embedUrl, "GOOGLE_DRIVE");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExplanationVideoResponse> listAllVideos() {
        return videoRepository.findAllWithQuestion().stream()
                .map(this::toResponse)
                .toList();
    }

    private ExplanationVideoResponse toResponse(QuestionExplanationVideo video) {
        return new ExplanationVideoResponse(
                video.getId(),
                video.getQuestion().getId(),
                video.getQuestion().getQuestionNumber(),
                video.getProvider(),
                video.getSourceUrl(),
                video.getExternalFileId(),
                video.getEmbedUrl(),
                video.getTitle(),
                video.getIsActive()
        );
    }
}
