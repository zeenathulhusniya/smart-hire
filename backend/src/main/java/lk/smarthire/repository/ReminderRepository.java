package lk.smarthire.repository;

import lk.smarthire.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUserIdOrderByDueDateAsc(Long userId);
    Optional<Reminder> findByIdAndUserId(Long id, Long userId);
}
