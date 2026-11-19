package lk.smarthire.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "saved_jobs",
    uniqueConstraints = @UniqueConstraint(name = "uk_user_saved_job", columnNames = {"user_id", "job_id"})
)
public class SavedJob extends BaseTimestampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private JobListing job;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public JobListing getJob() { return job; }
    public void setJob(JobListing job) { this.job = job; }
}
