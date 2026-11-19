package lk.smarthire.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class AuthDtos {
    public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 120) String fullName,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        String city,
        String targetRole
    ) {}

    public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record ForgotPasswordRequest(@NotBlank @Email String email) {}

    public record UserProfileDto(
        Long id,
        String fullName,
        String email,
        String phone,
        String city,
        String targetRole,
        String experienceLevel,
        String bio,
        List<String> skills,
        String githubUrl,
        String linkedinUrl,
        String portfolioUrl,
        String preferredLanguage,
        boolean emailRemindersEnabled,
        boolean interviewAlertsEnabled,
        boolean deadlineAlertsEnabled
    ) {}

    public record AuthResponse(String token, UserProfileDto user) {}
}
