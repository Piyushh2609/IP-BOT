package com.example.resumeassistant.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.io.File;

public class PdfParser {
    public static String extractText(String filepath) {
        try (PDDocument document = PDDocument.load(new File(filepath))) {
            if (!document.isEncrypted()) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document).trim();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
}
