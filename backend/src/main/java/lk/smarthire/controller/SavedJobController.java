package lk.smarthire.controller;

import lk.smarthire.service.SavedJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobController {

    private final SavedJobService savedJobService;

    public SavedJobController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    @GetMapping
    public List<Map<String, String>> list(Authentication auth) {
        return savedJobService.listSaved(auth.getName());
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<Void> save(Authentication auth, @PathVariable Long jobId) {
        savedJobService.save(auth.getName(), jobId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> remove(Authentication auth, @PathVariable Long jobId) {
        savedJobService.remove(auth.getName(), jobId);
        return ResponseEntity.noContent().build();
    }
}
