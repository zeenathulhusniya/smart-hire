package lk.smarthire.service;

import lk.smarthire.dto.AuthDtos.*;
import lk.smarthire.entity.User;
import lk.smarthire.exception.BadRequestException;
import lk.smarthire.exception.ResourceNotFoundException;
import lk.smarthire.repository.UserRepository;
import lk.smarthire.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email().toLowerCase())) {
            throw new BadRequestException("An account with this email already exists.");
        }
        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setCity(request.city() != null && !request.city().isBlank() ? request.city() : "Colombo, Sri Lanka");
        user.setTargetRole(request.targetRole());

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail(), saved.getId());
        return new AuthResponse(token, toProfileDto(saved));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.password())
        );
        User user = getByEmail(email);
        String token = jwtService.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, toProfileDto(user));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User account not found."));
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UserProfileDto dto) {
        User user = getByEmail(email);
        if (dto.fullName() != null && !dto.fullName().isBlank()) user.setFullName(dto.fullName().trim());
        user.setPhone(dto.phone());
        user.setCity(dto.city());
        user.setTargetRole(dto.targetRole());
        user.setExperienceLevel(dto.experienceLevel());
        user.setBio(dto.bio());
        user.setSkills(dto.skills() != null ? String.join(",", dto.skills()) : "");
        user.setGithubUrl(dto.githubUrl());
        user.setLinkedinUrl(dto.linkedinUrl());
        user.setPortfolioUrl(dto.portfolioUrl());
        if (dto.preferredLanguage() != null) user.setPreferredLanguage(dto.preferredLanguage());
        user.setEmailRemindersEnabled(dto.emailRemindersEnabled());
        user.setInterviewAlertsEnabled(dto.interviewAlertsEnabled());
        user.setDeadlineAlertsEnabled(dto.deadlineAlertsEnabled());

        return toProfileDto(userRepository.save(user));
    }

    public UserProfileDto toProfileDto(User user) {
        List<String> skillList = (user.getSkills() == null || user.getSkills().isBlank())
            ? List.of()
            : Arrays.stream(user.getSkills().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        return new UserProfileDto(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getCity(),
            user.getTargetRole(),
            user.getExperienceLevel(),
            user.getBio(),
            skillList,
            user.getGithubUrl(),
            user.getLinkedinUrl(),
            user.getPortfolioUrl(),
            user.getPreferredLanguage(),
            user.isEmailRemindersEnabled(),
            user.isInterviewAlertsEnabled(),
            user.isDeadlineAlertsEnabled()
        );
    }
}
