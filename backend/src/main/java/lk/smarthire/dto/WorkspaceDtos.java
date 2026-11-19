package lk.smarthire.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class WorkspaceDtos {

    public record JobCandidatePayload(
        @NotBlank String companyName,
        @NotBlank String jobTitle,
        @NotBlank String category,
        @NotBlank String description,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        String currency,
        @NotBlank String employmentType,
        @NotBlank String experienceLevel,
        List<String> requiredSkills,
        @NotBlank String remoteArrangement,
        @NotEmpty List<String> eligibleCountries,
        @NotBlank String jobSource,
        @NotBlank String originalUrl,
        @NotNull LocalDate postedDate,
        @NotNull LocalDate expiryDate
    ) {}

    public record ApplicationRequest(
        @NotBlank String companyName,
        @NotBlank String jobTitle,
        String location,
        String salary,
        LocalDate applicationDate,
        String jobUrl,
        String jobDescription,
        String notes,
        @NotBlank String status,
        LocalDate followUpDate
    ) {}

    public record StatusUpdateRequest(@NotBlank String status) {}

    public record InterviewRequest(
        @NotBlank String company,
        @NotBlank String jobTitle,
        @NotNull LocalDate interviewDate,
        @NotBlank String interviewTime,
        @NotBlank String interviewType,
        String meetingLink,
        String notes,
        @NotBlank String status
    ) {}

    public record ReminderRequest(
        @NotBlank String title,
        String description,
        @NotBlank String reminderType,
        @NotNull LocalDate dueDate,
        @NotBlank String dueTime,
        String relatedCompany,
        boolean completed
    ) {}

    public record ReminderCompleteRequest(boolean completed) {}

    public record ChatSendRequest(
        @NotBlank @Size(max = 2000) String message,
        @Pattern(regexp = "en|ta") String language
    ) {}

    public record AnalyticsSummaryResponse(
        long totalApplications,
        long appliedCount,
        long underReviewCount,
        long wishlistCount,
        long interviewCount,
        long offerCount,
        long rejectionCount,
        double interviewConversionRate,
        double offerConversionRate,
        List<StatusCountDto> statusDistribution,
        List<TrendPointDto> monthlyTrends,
        List<TrendPointDto> weeklyTrends,
        List<CompanyStatDto> companyStats
    ) {}

    public record StatusCountDto(String status, long count) {}
    public record TrendPointDto(String label, long count) {}
    public record CompanyStatDto(String company, long applications, long interviews, long offers) {}
}
