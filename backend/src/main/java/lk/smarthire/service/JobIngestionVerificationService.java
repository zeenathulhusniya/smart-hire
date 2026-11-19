package lk.smarthire.service;

import lk.smarthire.dto.WorkspaceDtos.JobCandidatePayload;
import lk.smarthire.entity.JobListing;
import lk.smarthire.entity.RemoteStatus;
import lk.smarthire.entity.VerificationStatus;
import lk.smarthire.exception.ResourceNotFoundException;
import lk.smarthire.repository.JobListingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class JobIngestionVerificationService {

    private final JobListingRepository jobListingRepository;

    public JobIngestionVerificationService(JobListingRepository jobListingRepository) {
        this.jobListingRepository = jobListingRepository;
    }

    public List<JobListing> getVerifiedSriLankaRemoteJobs() {
        return jobListingRepository.findAllVerifiedSriLankaRemoteJobs(
            VerificationStatus.VERIFIED,
            RemoteStatus.FULLY_REMOTE,
            LocalDate.now()
        );
    }

    public JobListing getVerifiedJobById(Long id) {
        JobListing job = jobListingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Job listing not found."));
        if (job.getVerificationStatus() != VerificationStatus.VERIFIED
            || job.getRemoteStatus() != RemoteStatus.FULLY_REMOTE
            || !job.isSriLankaEligible()
            || job.getExpiryDate().isBefore(LocalDate.now())) {
            throw new ResourceNotFoundException("Job listing is unavailable or not verified for Sri Lanka remote applicants.");
        }
        return job;
    }

    /**
     * Strict 8-point business verification before publishing a job:
     * 1. Valid employer URL & source
     * 2. Confirm FULLY_REMOTE (reject ONSITE or HYBRID)
     * 3. Confirm Sri Lankan residency eligibility (Sri Lanka / Worldwide / Global)
     * 4. Reject expired jobs
     * 5. Prevent duplicate listings by originalUrl
     */
    @Transactional
    public Optional<JobListing> verifyAndIngestCandidate(JobCandidatePayload payload) {
        if (payload.expiryDate().isBefore(LocalDate.now())) {
            return Optional.empty();
        }
        if (!isValidHttpUrl(payload.originalUrl())) {
            return Optional.empty();
        }
        if (!"FULLY_REMOTE".equalsIgnoreCase(payload.remoteArrangement())
            && !"REMOTE".equalsIgnoreCase(payload.remoteArrangement())) {
            return Optional.empty();
        }
        if (!isSriLankaEligible(payload.eligibleCountries())) {
            return Optional.empty();
        }
        if (jobListingRepository.existsByOriginalUrl(payload.originalUrl().trim())) {
            return Optional.empty();
        }

        JobListing listing = new JobListing();
        listing.setCompanyName(payload.companyName().trim());
        listing.setJobTitle(payload.jobTitle().trim());
        listing.setCategory(payload.category().trim());
        listing.setDescription(payload.description().trim());
        listing.setSalaryMin(payload.salaryMin());
        listing.setSalaryMax(payload.salaryMax());
        listing.setCurrency(payload.currency() != null ? payload.currency() : "LKR");
        listing.setEmploymentType(payload.employmentType());
        listing.setExperienceLevel(payload.experienceLevel());
        listing.setRequiredSkills(
            payload.requiredSkills() != null ? String.join(", ", payload.requiredSkills()) : ""
        );
        listing.setRemoteStatus(RemoteStatus.FULLY_REMOTE);
        listing.setEligibleCountries(String.join(", ", payload.eligibleCountries()));
        listing.setSriLankaEligible(true);
        listing.setJobSource(payload.jobSource().trim());
        listing.setOriginalUrl(payload.originalUrl().trim());
        listing.setPostedDate(payload.postedDate());
        listing.setExpiryDate(payload.expiryDate());
        listing.setVerificationStatus(VerificationStatus.VERIFIED);
        listing.setLastVerifiedAt(Instant.now());

        return Optional.of(jobListingRepository.save(listing));
    }

    public boolean isSriLankaEligible(List<String> eligibleCountries) {
        if (eligibleCountries == null || eligibleCountries.isEmpty()) {
            return false;
        }
        return eligibleCountries.stream().anyMatch(region -> {
            String normalized = region.trim().toLowerCase();
            return normalized.contains("sri lanka")
                || normalized.equals("worldwide")
                || normalized.equals("global")
                || normalized.equals("global remote")
                || normalized.equals("anywhere");
        });
    }

    private boolean isValidHttpUrl(String url) {
        return url != null && (url.startsWith("https://") || url.startsWith("http://"));
    }

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public int archiveExpiredListings() {
        return jobListingRepository.archiveExpiredJobs(LocalDate.now());
    }
}
