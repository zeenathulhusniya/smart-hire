package lk.smarthire.service;

import lk.smarthire.entity.ChatMessage;
import lk.smarthire.entity.User;
import lk.smarthire.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class CareerAssistantService {

    private final ChatMessageRepository chatRepository;
    private final AuthService authService;
    private final GeminiService geminiService;

    public CareerAssistantService(
        ChatMessageRepository chatRepository,
        AuthService authService,
        GeminiService geminiService
    ) {
        this.chatRepository = chatRepository;
        this.authService = authService;
        this.geminiService = geminiService;
    }

    public List<Map<String, Object>> getHistory(String email) {
        User user = authService.getByEmail(email);
        return chatRepository.findByUserIdOrderByCreatedAtAsc(user.getId()).stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional
    public Map<String, Object> sendMessage(String email, String messageText, String language) {
        User user = authService.getByEmail(email);
        String lang = "ta".equalsIgnoreCase(language) ? "ta" : "en";

        ChatMessage userMsg = new ChatMessage();
        userMsg.setUser(user);
        userMsg.setRole("user");
        userMsg.setContent(messageText);
        userMsg.setLanguage(lang);
        chatRepository.save(userMsg);

        String systemInstruction = "ta".equals(lang)
            ? "You are Smart Hire Career Assistant helping Sri Lankan remote job seekers. Respond clearly in simple Tamil (keeping technical Java/React/IT terms in English) with practical interview preparation, sample answers, resume tips, or follow-up email templates."
            : "You are Smart Hire Career Assistant helping Sri Lankan remote job seekers. Provide structured, practical guidance on technical interviews, HR questions, sample answers, resume improvements, and follow-up emails.";

        String reply = geminiService.generateText(systemInstruction, messageText, false);

        ChatMessage assistantMsg = new ChatMessage();
        assistantMsg.setUser(user);
        assistantMsg.setRole("assistant");
        assistantMsg.setContent(reply);
        assistantMsg.setLanguage(lang);
        ChatMessage saved = chatRepository.save(assistantMsg);

        return toDto(saved);
    }

    @Transactional
    public void clearHistory(String email) {
        User user = authService.getByEmail(email);
        chatRepository.deleteByUserId(user.getId());
    }

    private Map<String, Object> toDto(ChatMessage msg) {
        return Map.of(
            "id", String.valueOf(msg.getId()),
            "role", msg.getRole(),
            "content", msg.getContent(),
            "language", msg.getLanguage(),
            "source", "GEMINI_BACKEND",
            "timestamp", msg.getCreatedAt().toString()
        );
    }
}
