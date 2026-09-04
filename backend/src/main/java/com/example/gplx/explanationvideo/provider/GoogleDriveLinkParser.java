package com.example.gplx.explanationvideo.provider;

import com.example.gplx.common.exception.ApiException;
import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class GoogleDriveLinkParser {

    private static final Pattern FILE_ID_PATTERN = Pattern.compile(
            "/file/d/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)|/d/([a-zA-Z0-9_-]+)"
    );

    public String extractFileId(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw ApiException.badRequest("Link Google Drive không được để trống");
        }

        String trimmed = url.trim();
        try {
            URI uri = URI.create(trimmed);
            String host = uri.getHost();
            if (host == null || (!host.equalsIgnoreCase("drive.google.com") && !host.equalsIgnoreCase("docs.google.com"))) {
                throw ApiException.badRequest("Chỉ chấp nhận link từ domain drive.google.com");
            }
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest("Đường dẫn Google Drive không hợp lệ");
        }

        Matcher matcher = FILE_ID_PATTERN.matcher(trimmed);
        if (matcher.find()) {
            for (int i = 1; i <= matcher.groupCount(); i++) {
                String group = matcher.group(i);
                if (group != null && !group.isEmpty()) {
                    return group;
                }
            }
        }

        throw ApiException.badRequest("Không tìm thấy File ID trong link Google Drive");
    }

    public String generateEmbedUrl(String fileId) {
        return "https://drive.google.com/file/d/" + fileId + "/preview";
    }
}
