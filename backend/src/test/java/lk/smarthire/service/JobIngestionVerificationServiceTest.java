package lk.smarthire.service;

import lk.smarthire.dto.WorkspaceDtos.JobCandidatePayload;
import lk.smarthire.entity.JobListing;
import lk.smarthire.repository.JobListingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobIngestionVerificationServiceTest {

    @Mock
    private JobListingRepository jobListingRepository;

    @InjectMocks
    private JobIngestionVerificationService service;

    @Test
    void shouldAcceptVerifiedFullyRemoteSriLankaJob() {
        JobCandidatePayload payload = buildPayload("FULLY_REMOTE", List.of("Sri Lanka"), LocalDate.now().plusDays(30));
        when(jobListingRepository.existsByOriginalUrl(payload.originalUrl())).thenReturn(false);
        when(jobListingRepository.save(any(JobListing.class))).thenAnswer(inv -> inv.getArgument(0));

        Optional<JobListing> result = service.verifyAndIngestCandidate(payload);

        assertTrue(result.isPresent());
        assertTrue(result.get().isSriLankaEligible());
        verify(jobListingRepository).save(any(JobListing.class));
    }

    @Test
    void shouldRejectHybridOrOnsiteJobs() {
        JobCandidatePayload hybridPayload = buildPayload("HYBRID", List.of("Sri Lanka"), LocalDate.now().plusDays(30));
        Optional<JobListing> result = service.verifyAndIngestCandidate(hybridPayload);

        assertTrue(result.isEmpty());
        verify(jobListingRepository, never()).save(any());
    }

    @Test
    void shouldRejectJobsRestrictedToOtherCountries() {
        JobCandidatePayload usOnly = buildPayload("FULLY_REMOTE", List.of("United States Only"), LocalDate.now().plusDays(30));
        Optional<JobListing> result = service.verifyAndIngestCandidate(usOnly);

        assertTrue(result.isEmpty());
        verify(jobListingRepository, never()).save(any());
    }

    @Test
    void shouldRejectExpiredJobs() {
        JobCandidatePayload expired = buildPayload("FULLY_REMOTE", List.of("Sri Lanka"), LocalDate.now().minusDays(1));
        Optional<JobListing> result = service.verifyAndIngestCandidate(expired);

        assertTrue(result.isEmpty());
        verify(jobListingRepository, never()).save(any());
    }

    private JobCandidatePayload buildPayload(String remoteMode, List<String> countries, LocalDate expiry) {
        return new JobCandidatePayload(
            "WSO2",
            "Junior Java Engineer",
            "Java Developer",
            "Fully remote Java Spring Boot role open to Sri Lanka residents.",
            BigDecimal.valueOf(220000),
            BigDecimal.valueOf(340000),
            "LKR",
            "Full-time",
            "Junior",
            List.of("Java 21", "Spring Boot", "MySQL"),
            remoteMode,
            countries,
            "Official Career Portal",
            "https://wso2.com/careers/java-remote",
            LocalDate.now(),
            expiry
        );
    }
}
