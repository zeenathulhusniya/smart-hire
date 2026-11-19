package lk.smarthire.service;

import lk.smarthire.dto.WorkspaceDtos.ReminderRequest;
import lk.smarthire.entity.Reminder;
import lk.smarthire.entity.User;
import lk.smarthire.exception.ResourceNotFoundException;
import lk.smarthire.repository.ReminderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final AuthService authService;

    public ReminderService(ReminderRepository reminderRepository, AuthService authService) {
        this.reminderRepository = reminderRepository;
        this.authService = authService;
    }

    public List<Reminder> listUserReminders(String email) {
        User user = authService.getByEmail(email);
        return reminderRepository.findByUserIdOrderByDueDateAsc(user.getId());
    }

    @Transactional
    public Reminder create(String email, ReminderRequest req) {
        User user = authService.getByEmail(email);
        Reminder entity = new Reminder();
        entity.setUser(user);
        entity.setTitle(req.title().trim());
        entity.setDescription(req.description());
        entity.setReminderType(req.reminderType());
        entity.setDueDate(req.dueDate());
        entity.setDueTime(req.dueTime());
        entity.setRelatedCompany(req.relatedCompany());
        entity.setCompleted(req.completed());
        return reminderRepository.save(entity);
    }

    @Transactional
    public Reminder toggleComplete(String email, Long id, boolean completed) {
        User user = authService.getByEmail(email);
        Reminder entity = reminderRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Reminder not found."));
        entity.setCompleted(completed);
        return reminderRepository.save(entity);
    }

    @Transactional
    public void delete(String email, Long id) {
        User user = authService.getByEmail(email);
        Reminder entity = reminderRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Reminder not found."));
        reminderRepository.delete(entity);
    }
}
