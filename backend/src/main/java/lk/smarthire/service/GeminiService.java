package lk.smarthire.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public GeminiService(
        RestClient restClient,
        ObjectMapper objectMapper,
        @Value("${app.gemini.api-key:}") String apiKey,
        @Value("${app.gemini.model:gemini-4-hydrogen}") String model
    ) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    public String generateText(String systemInstruction, String userPrompt, boolean expectJson) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable is not configured on the Java server.");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
            + model + ":generateContent?key=" + apiKey;

        Map<String, Object> generationConfig = expectJson
            ? Map.of("responseMimeType", "application/json")
            : Map.of();

        Map<String, Object> requestBody = Map.of(
            "systemInstruction", Map.of("parts", List.of(Map.of("text", systemInstruction))),
            "contents", List.of(Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt)))),
            "generationConfig", generationConfig
        );

        String rawResponse = restClient.post()
            .uri(url)
            .contentType(MediaType.APPLICATION_JSON)
            .body(requestBody)
            .retrieve()
            .body(String.class);

        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            return root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to parse Gemini API response.", ex);
        }
    }
}
