package lk.smarthire.controller;

import lk.smarthire.service.ResumeAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeService;

    public ResumeAnalysisController(ResumeAnalysisService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> analyze(
        Authentication auth,
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam(value = "resumeText", required = false) String resumeText,
        @RequestParam("targetRole") String targetRole,
        @RequestParam("jobDescription") String jobDescription
    ) {
        return resumeService.analyzeAndSave(auth.getName(), file, resumeText, targetRole, jobDescription);
    }

    @GetMapping("/history")
    public List<Map<String, Object>> history(Authentication auth) {
        return resumeService.getHistory(auth.getName());
    }
}
