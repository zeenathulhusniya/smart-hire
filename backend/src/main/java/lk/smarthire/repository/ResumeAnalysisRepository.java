package lk.smarthire.repository;

import lk.smarthire.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
}
