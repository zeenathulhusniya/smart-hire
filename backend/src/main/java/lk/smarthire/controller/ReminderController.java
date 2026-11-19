package lk.smarthire.controller;

import jakarta.validation.Valid;
import lk.smarthire.dto.WorkspaceDtos.ReminderCompleteRequest;
import lk.smarthire.dto.WorkspaceDtos.ReminderRequest;
import lk.smarthire.entity.Reminder;
import lk.smarthire.service.ReminderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    public List<Map<String, Object>> list(Authentication auth) {
        return reminderService.listUserReminders(auth.getName()).stream()
            .map(this::toDto)
            .toList();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
        Authentication auth,
        @Valid @RequestBody ReminderRequest req
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(toDto(reminderService.create(auth.getName(), req)));
    }

    @PatchMapping("/{id}/complete")
    public Map<String, Object> toggleComplete(
        Authentication auth,
        @PathVariable Long id,
        @RequestBody ReminderCompleteRequest req
    ) {
        return toDto(reminderService.toggleComplete(auth.getName(), id, req.completed()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        reminderService.delete(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toDto(Reminder r) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", String.valueOf(r.getId()));
        map.put("userId", String.valueOf(r.getUser().getId()));
        map.put("title", r.getTitle());
        map.put("description", r.getDescription() != null ? r.getDescription() : "");
        map.put("reminderType", r.getReminderType());
        map.put("dueDate", r.getDueDate().toString());
        map.put("dueTime", r.getDueTime());
        map.put("relatedCompany", r.getRelatedCompany() != null ? r.getRelatedCompany() : "");
        map.put("completed", r.isCompleted());
        map.put("createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : "");
        return map;
    }
}
