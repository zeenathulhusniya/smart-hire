package lk.smarthire.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User extends BaseTimestampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 40)
    private String phone;

    @Column(length = 120)
    private String city = "Colombo, Sri Lanka";

    @Column(name = "target_role", length = 120)
    private String targetRole;

    @Column(name = "experience_level", length = 40)
    private String experienceLevel = "Internship";

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "preferred_language", length = 10)
    private String preferredLanguage = "en";

    @Column(name = "email_reminders_enabled", nullable = false)
    private boolean emailRemindersEnabled = true;

    @Column(name = "interview_alerts_enabled", nullable = false)
    private boolean interviewAlertsEnabled = true;

    @Column(name = "deadline_alerts_enabled", nullable = false)
    private boolean deadlineAlertsEnabled = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }
    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    public boolean isEmailRemindersEnabled() { return emailRemindersEnabled; }
    public void setEmailRemindersEnabled(boolean emailRemindersEnabled) { this.emailRemindersEnabled = emailRemindersEnabled; }
    public boolean isInterviewAlertsEnabled() { return interviewAlertsEnabled; }
    public void setInterviewAlertsEnabled(boolean interviewAlertsEnabled) { this.interviewAlertsEnabled = interviewAlertsEnabled; }
    public boolean isDeadlineAlertsEnabled() { return deadlineAlertsEnabled; }
    public void setDeadlineAlertsEnabled(boolean deadlineAlertsEnabled) { this.deadlineAlertsEnabled = deadlineAlertsEnabled; }
}
