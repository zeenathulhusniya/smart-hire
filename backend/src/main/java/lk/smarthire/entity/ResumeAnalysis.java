package lk.smarthire.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis extends BaseTimestampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "target_role", nullable = false, length = 180)
    private String targetRole;

    @Column(name = "match_score", nullable = false)
    private int matchScore;

    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(name = "missing_skills", columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "improvement_suggestions", columnDefinition = "TEXT")
    private String improvementSuggestions;

    @Column(name = "recommended_learning_areas", columnDefinition = "TEXT")
    private String recommendedLearningAreas;

    @Column(name = "extracted_preview", columnDefinition = "TEXT")
    private String extractedPreview;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }
    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    public String getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }
    public String getRecommendedLearningAreas() { return recommendedLearningAreas; }
    public void setRecommendedLearningAreas(String recommendedLearningAreas) { this.recommendedLearningAreas = recommendedLearningAreas; }
    public String getExtractedPreview() { return extractedPreview; }
    public void setExtractedPreview(String extractedPreview) { this.extractedPreview = extractedPreview; }
}
