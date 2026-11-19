package lk.smarthire.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lk.smarthire.entity.ResumeAnalysis;
import lk.smarthire.entity.User;
import lk.smarthire.exception.BadRequestException;
import lk.smarthire.repository.ResumeAnalysisRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@Service
public class ResumeAnalysisService {

    private static final long MAX_PDF_SIZE = 5 * 1024 * 1024L;

    private final ResumeAnalysisRepository resumeRepository;
    private final AuthService authService;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public ResumeAnalysisService(
        ResumeAnalysisRepository resumeRepository,
        AuthService authService,
        GeminiService geminiService,
        ObjectMapper objectMapper
    ) {
        this.resumeRepository = resumeRepository;
        this.authService = authService;
        this.geminiService = geminiService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public Map<String, Object> analyzeAndSave(
        String email,
        MultipartFile file,
        String resumeTextFallback,
        String targetRole,
        String jobDescription
    ) {
        User user = authService.getByEmail(email);
        String extractedText = resumeTextFallback != null ? resumeTextFallback.trim() : "";
        String fileName = "pasted-resume.pdf";

        if (file != null && !file.isEmpty()) {
            validatePdf(file);
            fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
            String pdfText = extractTextFromPdf(file);
            if (!pdfText.isBlank()) {
                extractedText = pdfText;
            }
        }

        if (extractedText.length() < 30) {
            throw new BadRequestException("Resume text is empty or unreadable. Please upload a text-based PDF or paste resume text.");
        }

        String systemPrompt = """
            You are an expert technical recruiter evaluating resumes for Sri Lanka remote software and digital jobs.
            Return ONLY valid JSON with these exact keys:
            {
              "matchScore": integer (0-100),
              "matchedSkills": string[],
              "missingSkills": string[],
              "strengths": string[],
              "improvementSuggestions": string[],
              "recommendedLearningAreas": string[]
            }
            """;

        String userPrompt = "Target Role: " + targetRole
            + "\n\nJob Description:\n" + jobDescription
            + "\n\nCandidate Resume Text:\n" + extractedText.substring(0, Math.min(extractedText.length(), 8000));

        String jsonOutput = geminiService.generateText(systemPrompt, userPrompt, true);

        try {
            JsonNode node = objectMapper.readTree(jsonOutput);
            int matchScore = node.path("matchScore").asInt(0);
            List<String> matched = toList(node.path("matchedSkills"));
            List<String> missing = toList(node.path("missingSkills"));
            List<String> strengths = toList(node.path("strengths"));
            List<String> suggestions = toList(node.path("improvementSuggestions"));
            List<String> learning = toList(node.path("recommendedLearningAreas"));

            ResumeAnalysis entity = new ResumeAnalysis();
            entity.setUser(user);
            entity.setFileName(fileName);
            entity.setTargetRole(targetRole);
            entity.setMatchScore(matchScore);
            entity.setMatchedSkills(String.join("|", matched));
            entity.setMissingSkills(String.join("|", missing));
            entity.setStrengths(String.join("|", strengths));
            entity.setImprovementSuggestions(String.join("|", suggestions));
            entity.setRecommendedLearningAreas(String.join("|", learning));
            entity.setExtractedPreview(extractedText.substring(0, Math.min(extractedText.length(), 800)));

            ResumeAnalysis saved = resumeRepository.save(entity);
            return toResponseMap(saved, matched, missing, strengths, suggestions, learning);
        } catch (Exception ex) {
            throw new RuntimeException("Unable to parse structured Gemini resume evaluation.", ex);
        }
    }

    public List<Map<String, Object>> getHistory(String email) {
        User user = authService.getByEmail(email);
        return resumeRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(r -> toResponseMap(
                r,
                splitPipe(r.getMatchedSkills()),
                splitPipe(r.getMissingSkills()),
                splitPipe(r.getStrengths()),
                splitPipe(r.getImprovementSuggestions()),
                splitPipe(r.getRecommendedLearningAreas())
            ))
            .toList();
    }

    private void validatePdf(MultipartFile file) {
        if (file.getSize() > MAX_PDF_SIZE) {
            throw new BadRequestException("PDF file exceeds maximum 5 MB limit.");
        }
        String name = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";
        if (!name.endsWith(".pdf") && !contentType.equals("application/pdf")) {
            throw new BadRequestException("Only PDF (.pdf) resume files are allowed.");
        }
    }

    private String extractTextFromPdf(MultipartFile file) {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(doc).trim();
        } catch (IOException ex) {
            throw new BadRequestException("Uploaded file is corrupted or not a valid PDF document.");
        }
    }

    private List<String> toList(JsonNode arrayNode) {
        List<String> items = new ArrayList<>();
        if (arrayNode.isArray()) {
            arrayNode.forEach(item -> items.add(item.asText()));
        }
        return items;
    }

    private List<String> splitPipe(String raw) {
        if (raw == null || raw.isBlank()) return List.of();
        return Arrays.stream(raw.split("\\|")).filter(s -> !s.isBlank()).toList();
    }

    private Map<String, Object> toResponseMap(
        ResumeAnalysis entity,
        List<String> matched,
        List<String> missing,
        List<String> strengths,
        List<String> suggestions,
        List<String> learning
    ) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id", String.valueOf(entity.getId()));
        res.put("fileName", entity.getFileName());
        res.put("targetRole", entity.getTargetRole());
        res.put("matchScore", entity.getMatchScore());
        res.put("matchedSkills", matched);
        res.put("missingSkills", missing);
        res.put("strengths", strengths);
        res.put("improvementSuggestions", suggestions);
        res.put("recommendedLearningAreas", learning);
        res.put("extractedPreview", entity.getExtractedPreview());
        res.put("analysisSource", "GEMINI_BACKEND");
        res.put("createdAt", entity.getCreatedAt().toString());
        return res;
    }
}
