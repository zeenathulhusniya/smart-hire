package lk.smarthire.service;

import lk.smarthire.entity.JobListing;
import lk.smarthire.entity.SavedJob;
import lk.smarthire.entity.User;
import lk.smarthire.exception.ResourceNotFoundException;
import lk.smarthire.repository.SavedJobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final AuthService authService;
    private final JobIngestionVerificationService jobService;

    public SavedJobService(
        SavedJobRepository savedJobRepository,
        AuthService authService,
        JobIngestionVerificationService jobService
    ) {
        this.savedJobRepository = savedJobRepository;
        this.authService = authService;
        this.jobService = jobService;
    }

    public List<Map<String, String>> listSaved(String email) {
        User user = authService.getByEmail(email);
        return savedJobRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(s -> Map.of("jobId", String.valueOf(s.getJob().getId())))
            .toList();
    }

    @Transactional
    public void save(String email, Long jobId) {
        User user = authService.getByEmail(email);
        if (savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            return;
        }
        JobListing job = jobService.getVerifiedJobById(jobId);
        SavedJob savedJob = new SavedJob();
        savedJob.setUser(user);
        savedJob.setJob(job);
        savedJobRepository.save(savedJob);
    }

    @Transactional
    public void remove(String email, Long jobId) {
        User user = authService.getByEmail(email);
        SavedJob saved = savedJobRepository.findByUserIdAndJobId(user.getId(), jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Saved job not found."));
        savedJobRepository.delete(saved);
    }
}
