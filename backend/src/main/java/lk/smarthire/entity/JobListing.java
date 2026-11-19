package lk.smarthire.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "job_listings")
public class JobListing extends BaseTimestampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 140)
    private String companyName;

    @Column(name = "job_title", nullable = false, length = 180)
    private String jobTitle;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String salary;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(nullable = false, length = 10)
    private String currency = "LKR";

    @Column(name = "employment_type", nullable = false, length = 40)
    private String employmentType;

    @Column(name = "experience_level", nullable = false, length = 40)
    private String experienceLevel;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Enumerated(EnumType.STRING)
    @Column(name = "remote_status", nullable = false, length = 30)
    private RemoteStatus remoteStatus;

    @Column(name = "eligible_countries", nullable = false)
    private String eligibleCountries;

    @Column(name = "sri_lanka_eligible", nullable = false)
    private boolean sriLankaEligible;

    @Column(name = "job_source", nullable = false, length = 120)
    private String jobSource;

    @Column(name = "original_url", nullable = false, unique = true, length = 500)
    private String originalUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 30)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "last_verified_at")
    private Instant lastVerifiedAt;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }
    public BigDecimal getSalaryMin() { return salaryMin; }
    public void setSalaryMin(BigDecimal salaryMin) { this.salaryMin = salaryMin; }
    public BigDecimal getSalaryMax() { return salaryMax; }
    public void setSalaryMax(BigDecimal salaryMax) { this.salaryMax = salaryMax; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public RemoteStatus getRemoteStatus() { return remoteStatus; }
    public void setRemoteStatus(RemoteStatus remoteStatus) { this.remoteStatus = remoteStatus; }
    public String getEligibleCountries() { return eligibleCountries; }
    public void setEligibleCountries(String eligibleCountries) { this.eligibleCountries = eligibleCountries; }
    public boolean isSriLankaEligible() { return sriLankaEligible; }
    public void setSriLankaEligible(boolean sriLankaEligible) { this.sriLankaEligible = sriLankaEligible; }
    public String getJobSource() { return jobSource; }
    public void setJobSource(String jobSource) { this.jobSource = jobSource; }
    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }
    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public Instant getLastVerifiedAt() { return lastVerifiedAt; }
    public void setLastVerifiedAt(Instant lastVerifiedAt) { this.lastVerifiedAt = lastVerifiedAt; }
    public LocalDate getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDate postedDate) { this.postedDate = postedDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
