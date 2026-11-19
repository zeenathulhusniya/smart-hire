package lk.smarthire.controller;

import jakarta.validation.Valid;
import lk.smarthire.dto.WorkspaceDtos.ChatSendRequest;
import lk.smarthire.service.CareerAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class CareerAssistantController {

    private final CareerAssistantService chatService;

    public CareerAssistantController(CareerAssistantService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/history")
    public List<Map<String, Object>> history(Authentication auth) {
        return chatService.getHistory(auth.getName());
    }

    @PostMapping("/send")
    public Map<String, Object> send(
        Authentication auth,
        @Valid @RequestBody ChatSendRequest request
    ) {
        return chatService.sendMessage(auth.getName(), request.message(), request.language());
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clear(Authentication auth) {
        chatService.clearHistory(auth.getName());
        return ResponseEntity.noContent().build();
    }
}
