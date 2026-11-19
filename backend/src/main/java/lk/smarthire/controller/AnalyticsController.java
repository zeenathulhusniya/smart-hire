package lk.smarthire.controller;

import lk.smarthire.dto.WorkspaceDtos.AnalyticsSummaryResponse;
import lk.smarthire.service.AnalyticsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public AnalyticsSummaryResponse summary(Authentication auth) {
        return analyticsService.getUserAnalytics(auth.getName());
    }
}
