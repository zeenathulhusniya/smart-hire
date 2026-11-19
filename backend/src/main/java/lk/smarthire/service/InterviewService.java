package lk.smarthire.service;

import lk.smarthire.dto.WorkspaceDtos.InterviewRequest;
import lk.smarthire.entity.Interview;
import lk.smarthire.entity.User;
import lk.smarthire.exception.ResourceNotFoundException;
import lk.smarthire.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final AuthService authService;

    public InterviewService(InterviewRepository interviewRepository, AuthService authService) {
        this.interviewRepository = interviewRepository;
        this.authService = authService;
    }

    public List<Interview> listUserInterviews(String email) {
        User user = authService.getByEmail(email);
        return interviewRepository.findByUserIdOrderByInterviewDateAsc(user.getId());
    }

    @Transactional
    public Interview create(String email, InterviewRequest req) {
        User user = authService.getByEmail(email);
        Interview entity = new Interview();
        entity.setUser(user);
        applyFields(entity, req);
        return interviewRepository.save(entity);
    }

    @Transactional
    public Interview update(String email, Long id, InterviewRequest req) {
        User user = authService.getByEmail(email);
        Interview entity = interviewRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found."));
        applyFields(entity, req);
        return interviewRepository.save(entity);
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = authService.getByEmail(email);
        Interview entity = interviewRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Interview not found."));
        interviewRepository.delete(entity);
    }

    private void applyFields(Interview entity, InterviewRequest req) {
        entity.setCompany(req.company().trim());
        entity.setJobTitle(req.jobTitle().trim());
        entity.setInterviewDate(req.interviewDate());
        entity.setInterviewTime(req.interviewTime());
        entity.setInterviewType(req.interviewType());
        entity.setMeetingLink(req.meetingLink());
        entity.setNotes(req.notes());
        entity.setStatus(req.status());
    }
}
