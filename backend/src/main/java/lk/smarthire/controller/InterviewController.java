package lk.smarthire.controller;

import jakarta.validation.Valid;
import lk.smarthire.dto.WorkspaceDtos.InterviewRequest;
import lk.smarthire.entity.Interview;
import lk.smarthire.service.InterviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<Map<String, Object>> list(Authentication auth) {
        return interviewService.listUserInterviews(auth.getName()).stream()
            .map(this::toDto)
            .toList();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
        Authentication auth,
        @Valid @RequestBody InterviewRequest req
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(toDto(interviewService.create(auth.getName(), req)));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(
        Authentication auth,
        @PathVariable Long id,
        @Valid @RequestBody InterviewRequest req
    ) {
        return toDto(interviewService.update(auth.getName(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        interviewService.delete(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toDto(Interview i) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", String.valueOf(i.getId()));
        map.put("userId", String.valueOf(i.getUser().getId()));
        map.put("company", i.getCompany());
        map.put("jobTitle", i.getJobTitle());
        map.put("interviewDate", i.getInterviewDate().toString());
        map.put("interviewTime", i.getInterviewTime());
        map.put("interviewType", i.getInterviewType());
        map.put("meetingLink", i.getMeetingLink() != null ? i.getMeetingLink() : "");
        map.put("notes", i.getNotes() != null ? i.getNotes() : "");
        map.put("status", i.getStatus());
        map.put("createdAt", i.getCreatedAt() != null ? i.getCreatedAt().toString() : "");
        return map;
    }
}
