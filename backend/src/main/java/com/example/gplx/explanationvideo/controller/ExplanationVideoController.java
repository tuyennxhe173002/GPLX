package com.example.gplx.explanationvideo.controller;

import com.example.gplx.auth.service.CurrentUserService;
import com.example.gplx.explanationvideo.dto.request.ExplanationVideoRequest;
import com.example.gplx.explanationvideo.dto.request.VideoPreviewRequest;
import com.example.gplx.explanationvideo.dto.response.ExplanationVideoResponse;
import com.example.gplx.explanationvideo.dto.response.VideoPreviewResponse;
import com.example.gplx.explanationvideo.service.ExplanationVideoService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ExplanationVideoController {

    private final ExplanationVideoService videoService;
    private final CurrentUserService currentUserService;

    @GetMapping("/api/v1/questions/{questionId}/explanation-video")
    public ExplanationVideoResponse getVideoByQuestionId(@PathVariable Long questionId) {
        return videoService.getVideoByQuestionId(questionId);
    }

    @PostMapping("/api/v1/questions/{questionId}/explanation-video")
    @PreAuthorize("hasAuthority('VIDEO_CREATE') or hasRole('ADMIN')")
    public ExplanationVideoResponse createVideo(
            @PathVariable Long questionId,
            @Valid @RequestBody ExplanationVideoRequest request
    ) {
        return videoService.saveOrUpdateVideo(questionId, request, currentUserService.getCurrentUserIdOrNull());
    }

    @PutMapping("/api/v1/questions/{questionId}/explanation-video")
    @PreAuthorize("hasAuthority('VIDEO_UPDATE') or hasRole('ADMIN')")
    public ExplanationVideoResponse updateVideo(
            @PathVariable Long questionId,
            @Valid @RequestBody ExplanationVideoRequest request
    ) {
        return videoService.saveOrUpdateVideo(questionId, request, currentUserService.getCurrentUserIdOrNull());
    }

    @DeleteMapping("/api/v1/questions/{questionId}/explanation-video")
    @PreAuthorize("hasAuthority('VIDEO_DELETE') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVideo(@PathVariable Long questionId) {
        videoService.deleteVideo(questionId);
    }

    @PostMapping("/api/v1/explanation-videos/preview")
    public VideoPreviewResponse previewVideo(@Valid @RequestBody VideoPreviewRequest request) {
        return videoService.previewVideo(request);
    }

    @GetMapping("/api/v1/explanation-videos")
    public List<ExplanationVideoResponse> listAllVideos() {
        return videoService.listAllVideos();
    }
}
