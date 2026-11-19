package lk.smarthire.service;

import lk.smarthire.dto.WorkspaceDtos.ApplicationRequest;
import lk.smarthire.entity.JobApplication;
import lk.smarthire.entity.User;
import lk.smarthire.exception.ResourceNotFoundException;
import lk.smarthire.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final AuthService authService;

    public JobApplicationService(
        JobApplicationRepository applicationRepository,
        AuthService authService
    ) {
        this.applicationRepository = applicationRepository;
        this.authService = authService;
    }

    public List<JobApplication> listUserApplications(String email) {
        User user = authService.getByEmail(email);
        return applicationRepository.findByUserIdOrderByApplicationDateDesc(user.getId());
    }

    @Transactional
    public JobApplication createApplication(String email, ApplicationRequest req) {
        User user = authService.getByEmail(email);
        JobApplication app = new JobApplication();
        app.setUser(user);
        applyFields(app, req);
        return applicationRepository.save(app);
    }

    @Transactional
    public JobApplication updateApplication(String email, Long id, ApplicationRequest req) {
        User user = authService.getByEmail(email);
        JobApplication app = applicationRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Application not found."));
        applyFields(app, req);
        return applicationRepository.save(app);
    }

    @Transactional
    public JobApplication updateStatus(String email, Long id, String status) {
        User user = authService.getByEmail(email);
        JobApplication app = applicationRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Application not found."));
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    @Transactional
    public void deleteApplication(String email, Long id) {
        User user = authService.getByEmail(email);
        JobApplication app = applicationRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Application not found."));
        applicationRepository.delete(app);
    }

    private void applyFields(JobApplication app, ApplicationRequest req) {
        app.setCompanyName(req.companyName().trim());
        app.setJobTitle(req.jobTitle().trim());
        app.setLocation(req.location() != null ? req.location() : "Fully Remote (Sri Lanka)");
        app.setSalary(req.salary());
        app.setApplicationDate(req.applicationDate() != null ? req.applicationDate() : LocalDate.now());
        app.setJobUrl(req.jobUrl());
        app.setJobDescription(req.jobDescription());
        app.setNotes(req.notes());
        app.setStatus(req.status());
        app.setFollowUpDate(req.followUpDate());
    }
}
