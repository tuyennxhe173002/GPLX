package com.example.gplx.seed.service.impl;

import com.example.gplx.question.repository.QuestionRepository;
import com.example.gplx.seed.service.DataImportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class DataImportIntegrationTest {

    @Autowired
    private DataImportService dataImportService;

    @Autowired
    private QuestionRepository questionRepository;

    @Test
    public void testImport600Questions() {
        dataImportService.importData();
        long count = questionRepository.count();
        System.out.println("=== IMPORT COMPLETED SUCCESSFULLY ===");
        System.out.println("TOTAL QUESTIONS IN DATABASE: " + count);
        assertEquals(600, count, "Database must contain exactly 600 questions after import!");
    }
}
