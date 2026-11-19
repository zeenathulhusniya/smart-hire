package lk.smarthire.controller;

import jakarta.validation.Valid;
import lk.smarthire.dto.WorkspaceDtos.JobCandidatePayload;
import lk.smarthire.entity.JobListing;
import lk.smarthire.service.JobIngestionVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/jobs")
public class JobListingController {

    private final JobIngestionVerificationService jobService;

    public JobListingController(JobIngestionVerificationService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/verified")
    public List<Map<String, Object>> listVerifiedSriLankaRemoteJobs() {
        return jobService.getVerifiedSriLankaRemoteJobs().stream()
            .map(this::toResponse)
            .toList();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getJobById(@PathVariable Long id) {
        return toResponse(jobService.getVerifiedJobById(id));
    }

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, Object>> ingestCandidate(
        @Valid @RequestBody JobCandidatePayload payload
    ) {
        return jobService.verifyAndIngestCandidate(payload)
            .map(saved -> ResponseEntity.ok(toResponse(saved)))
            .orElseGet(() -> ResponseEntity.unprocessableEntity().body(
                Map.of("message", "Rejected: Listing did not pass Sri Lanka eligibility, remote-only, non-expired, or duplicate checks.")
            ));
    }

    private Map<String, Object> toResponse(JobListing j) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", String.valueOf(j.getId()));
        map.put("companyName", j.getCompanyName());
        map.put("companyLogoText", j.getCompanyName().substring(0, Math.min(2, j.getCompanyName().length())).toUpperCase());
        map.put("companyAccentColor", "#0F172A");
        map.put("jobTitle", j.getJobTitle());
        map.put("category", j.getCategory());
        map.put("description", j.getDescription());
        map.put("responsibilities", List.of());
        map.put("requirements", List.of());
        map.put("salaryMin", j.getSalaryMin());
        map.put("salaryMax", j.getSalaryMax());
        map.put("currency", j.getCurrency());
        map.put("employmentType", j.getEmploymentType());
        map.put("experienceLevel", j.getExperienceLevel());
        map.put("requiredSkills", j.getRequiredSkills() == null ? List.of() : Arrays.stream(j.getRequiredSkills().split(",")).map(String::trim).toList());
        map.put("remoteStatus", j.getRemoteStatus().name());
        map.put("eligibleCountries", Arrays.stream(j.getEligibleCountries().split(",")).map(String::trim).toList());
        map.put("sriLankaEligible", j.isSriLankaEligible());
        map.put("jobSource", j.getJobSource());
        map.put("originalUrl", j.getOriginalUrl());
        map.put("verificationStatus", j.getVerificationStatus().name());
        map.put("postedDate", j.getPostedDate().toString());
        map.put("expiryDate", j.getExpiryDate().toString());
        map.put("lastVerifiedAt", j.getLastVerifiedAt() != null ? j.getLastVerifiedAt().toString() : "");
        return map;
    }
}
