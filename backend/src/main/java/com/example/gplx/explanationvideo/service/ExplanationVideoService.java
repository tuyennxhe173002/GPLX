package com.example.gplx.explanationvideo.service;

import com.example.gplx.explanationvideo.dto.request.ExplanationVideoRequest;
import com.example.gplx.explanationvideo.dto.request.VideoPreviewRequest;
import com.example.gplx.explanationvideo.dto.response.ExplanationVideoResponse;
import com.example.gplx.explanationvideo.dto.response.VideoPreviewResponse;
import java.util.List;

public interface ExplanationVideoService {

    ExplanationVideoResponse getVideoByQuestionId(Long questionId);

    ExplanationVideoResponse saveOrUpdateVideo(Long questionId, ExplanationVideoRequest request, Long userId);

    void deleteVideo(Long questionId);

    VideoPreviewResponse previewVideo(VideoPreviewRequest request);

    List<ExplanationVideoResponse> listAllVideos();
}
