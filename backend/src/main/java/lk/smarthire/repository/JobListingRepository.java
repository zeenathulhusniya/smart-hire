package lk.smarthire.repository;

import lk.smarthire.entity.JobListing;
import lk.smarthire.entity.RemoteStatus;
import lk.smarthire.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface JobListingRepository extends JpaRepository<JobListing, Long> {

    @Query("""
        SELECT j FROM JobListing j
        WHERE j.verificationStatus = :verifiedStatus
          AND j.remoteStatus = :remoteStatus
          AND j.sriLankaEligible = true
          AND j.expiryDate >= :today
        ORDER BY j.postedDate DESC
        """)
    List<JobListing> findAllVerifiedSriLankaRemoteJobs(
        @Param("verifiedStatus") VerificationStatus verifiedStatus,
        @Param("remoteStatus") RemoteStatus remoteStatus,
        @Param("today") LocalDate today
    );

    Optional<JobListing> findByOriginalUrl(String originalUrl);

    boolean existsByOriginalUrl(String originalUrl);

    @Modifying
    @Query("UPDATE JobListing j SET j.verificationStatus = 'EXPIRED' WHERE j.expiryDate < :today AND j.verificationStatus <> 'EXPIRED'")
    int archiveExpiredJobs(@Param("today") LocalDate today);
}
