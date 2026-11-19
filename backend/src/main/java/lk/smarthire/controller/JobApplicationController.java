package lk.smarthire.controller;

import jakarta.validation.Valid;
import lk.smarthire.dto.WorkspaceDtos.ApplicationRequest;
import lk.smarthire.dto.WorkspaceDtos.StatusUpdateRequest;
import lk.smarthire.entity.JobApplication;
import lk.smarthire.service.JobApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<Map<String, Object>> list(Authentication auth) {
        return applicationService.listUserApplications(auth.getName()).stream()
            .map(this::toDto)
            .toList();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
        Authentication auth,
        @Valid @RequestBody ApplicationRequest req
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(toDto(applicationService.createApplication(auth.getName(), req)));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(
        Authentication auth,
        @PathVariable Long id,
        @Valid @RequestBody ApplicationRequest req
    ) {
        return toDto(applicationService.updateApplication(auth.getName(), id, req));
    }

    @PatchMapping("/{id}/status")
    public Map<String, Object> updateStatus(
        Authentication auth,
        @PathVariable Long id,
        @Valid @RequestBody StatusUpdateRequest req
    ) {
        return toDto(applicationService.updateStatus(auth.getName(), id, req.status()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        applicationService.deleteApplication(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toDto(JobApplication a) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", String.valueOf(a.getId()));
        map.put("userId", String.valueOf(a.getUser().getId()));
        map.put("companyName", a.getCompanyName());
        map.put("jobTitle", a.getJobTitle());
        map.put("location", a.getLocation());
        map.put("salary", a.getSalary() != null ? a.getSalary() : "");
        map.put("applicationDate", a.getApplicationDate() != null ? a.getApplicationDate().toString() : "");
        map.put("jobUrl", a.getJobUrl() != null ? a.getJobUrl() : "");
        map.put("jobDescription", a.getJobDescription() != null ? a.getJobDescription() : "");
        map.put("notes", a.getNotes() != null ? a.getNotes() : "");
        map.put("status", a.getStatus());
        map.put("followUpDate", a.getFollowUpDate() != null ? a.getFollowUpDate().toString() : "");
        map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : "");
        map.put("updatedAt", a.getUpdatedAt() != null ? a.getUpdatedAt().toString() : "");
        return map;
    }
}
