package lk.smarthire.repository;

import lk.smarthire.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserIdOrderByInterviewDateAsc(Long userId);
    Optional<Interview> findByIdAndUserId(Long id, Long userId);
}
