package com.example.gplx.seed.runner;

import com.example.gplx.seed.service.DataImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataImportRunner implements CommandLineRunner {

    private final DataImportService dataImportService;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (seedEnabled) {
            dataImportService.importData();
        }
    }
}
