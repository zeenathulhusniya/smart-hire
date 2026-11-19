package lk.smarthire.controller;

import lk.smarthire.dto.AuthDtos.UserProfileDto;
import lk.smarthire.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public UserProfileDto getProfile(Authentication auth) {
        return authService.toProfileDto(authService.getByEmail(auth.getName()));
    }

    @PutMapping("/me")
    public UserProfileDto updateProfile(
        Authentication auth,
        @RequestBody UserProfileDto dto
    ) {
        return authService.updateProfile(auth.getName(), dto);
    }
}
