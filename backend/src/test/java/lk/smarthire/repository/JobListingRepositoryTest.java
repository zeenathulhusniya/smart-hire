package lk.smarthire.repository;

import lk.smarthire.entity.JobListing;
import lk.smarthire.entity.RemoteStatus;
import lk.smarthire.entity.VerificationStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
@ActiveProfiles("test")
class JobListingRepositoryTest {

    @Autowired
    private JobListingRepository repository;

    @Test
    void shouldReturnOnlyVerifiedFullyRemoteSriLankaNonExpiredJobs() {
        JobListing valid = buildJob("https://wso2.com/1", RemoteStatus.FULLY_REMOTE, true, VerificationStatus.VERIFIED, LocalDate.now().plusDays(10));
        JobListing hybrid = buildJob("https://other.com/2", RemoteStatus.HYBRID, true, VerificationStatus.VERIFIED, LocalDate.now().plusDays(10));
        JobListing nonSl = buildJob("https://other.com/3", RemoteStatus.FULLY_REMOTE, false, VerificationStatus.VERIFIED, LocalDate.now().plusDays(10));
        JobListing expired = buildJob("https://other.com/4", RemoteStatus.FULLY_REMOTE, true, VerificationStatus.VERIFIED, LocalDate.now().minusDays(2));

        repository.saveAll(List.of(valid, hybrid, nonSl, expired));

        List<JobListing> found = repository.findAllVerifiedSriLankaRemoteJobs(
            VerificationStatus.VERIFIED,
            RemoteStatus.FULLY_REMOTE,
            LocalDate.now()
        );

        assertEquals(1, found.size());
        assertEquals("https://wso2.com/1", found.get(0).getOriginalUrl());
    }

    private JobListing buildJob(String url, RemoteStatus remote, boolean sl, VerificationStatus status, LocalDate expiry) {
        JobListing j = new JobListing();
        j.setCompanyName("TestCo");
        j.setJobTitle("Java Developer");
        j.setCategory("Java Developer");
        j.setDescription("Description");
        j.setEmploymentType("Full-time");
        j.setExperienceLevel("Junior");
        j.setRemoteStatus(remote);
        j.setEligibleCountries(sl ? "Sri Lanka" : "US Only");
        j.setSriLankaEligible(sl);
        j.setJobSource("Official Portal");
        j.setOriginalUrl(url);
        j.setVerificationStatus(status);
        j.setPostedDate(LocalDate.now());
        j.setExpiryDate(expiry);
        return j;
    }
}
