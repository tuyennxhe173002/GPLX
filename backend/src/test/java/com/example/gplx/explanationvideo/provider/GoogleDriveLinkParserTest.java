package com.example.gplx.explanationvideo.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.gplx.common.exception.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class GoogleDriveLinkParserTest {

    private GoogleDriveLinkParser parser;

    @BeforeEach
    void setUp() {
        parser = new GoogleDriveLinkParser();
    }

    @Test
    void extractFileIdFromStandardShareLink() {
        String url = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing";
        String fileId = parser.extractFileId(url);
        assertThat(fileId).isEqualTo("1A2B3C4D5E6F7G8H9I0J");

        String embedUrl = parser.generateEmbedUrl(fileId);
        assertThat(embedUrl).isEqualTo("https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/preview");
    }

    @Test
    void extractFileIdFromQueryParamLink() {
        String url = "https://drive.google.com/open?id=XYZ123_abc";
        String fileId = parser.extractFileId(url);
        assertThat(fileId).isEqualTo("XYZ123_abc");
    }

    @Test
    void rejectNonGoogleDriveUrl() {
        String url = "https://youtube.com/watch?v=12345";
        ApiException exception = assertThrows(ApiException.class, () -> parser.extractFileId(url));
        assertThat(exception.getMessage()).contains("drive.google.com");
    }

    @Test
    void rejectInvalidOrEmptyUrl() {
        assertThrows(ApiException.class, () -> parser.extractFileId(""));
        assertThrows(ApiException.class, () -> parser.extractFileId("not-a-url"));
    }
}
