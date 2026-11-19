package lk.smarthire.service;

import lk.smarthire.dto.WorkspaceDtos.AnalyticsSummaryResponse;
import lk.smarthire.entity.JobApplication;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private JobApplicationService applicationService;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void shouldReturnZeroMetricsWhenNoApplicationsExist() {
        when(applicationService.listUserApplications("test@smarthire.lk")).thenReturn(List.of());

        AnalyticsSummaryResponse res = analyticsService.getUserAnalytics("test@smarthire.lk");

        assertEquals(0, res.totalApplications());
        assertEquals(0.0, res.interviewConversionRate());
        assertEquals(0.0, res.offerConversionRate());
    }

    @Test
    void shouldComputeAccurateConversionRates() {
        JobApplication a1 = new JobApplication();
        a1.setCompanyName("WSO2");
        a1.setStatus("Interview");
        a1.setApplicationDate(LocalDate.of(2026, 11, 1));

        JobApplication a2 = new JobApplication();
        a2.setCompanyName("99x");
        a2.setStatus("Applied");
        a2.setApplicationDate(LocalDate.of(2026, 11, 2));

        when(applicationService.listUserApplications("test@smarthire.lk")).thenReturn(List.of(a1, a2));

        AnalyticsSummaryResponse res = analyticsService.getUserAnalytics("test@smarthire.lk");

        assertEquals(2, res.totalApplications());
        assertEquals(1, res.interviewCount());
        assertEquals(50.0, res.interviewConversionRate());
    }
}
