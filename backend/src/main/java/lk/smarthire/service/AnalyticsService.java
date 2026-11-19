package lk.smarthire.service;

import lk.smarthire.dto.WorkspaceDtos.*;
import lk.smarthire.entity.JobApplication;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AnalyticsService {

    private final JobApplicationService applicationService;

    private static final List<String> ORDERED_STATUSES = List.of(
        "Wishlist", "Applied", "Under Review", "Interview", "Offered", "Rejected"
    );

    public AnalyticsService(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    public AnalyticsSummaryResponse getUserAnalytics(String email) {
        List<JobApplication> apps = applicationService.listUserApplications(email);
        long total = apps.size();
        long wishlist = countStatus(apps, "Wishlist");
        long applied = countStatus(apps, "Applied");
        long underReview = countStatus(apps, "Under Review");
        long interviews = countStatus(apps, "Interview");
        long offers = countStatus(apps, "Offered");
        long rejections = countStatus(apps, "Rejected");

        long submitted = total - wishlist;
        double interviewRate = submitted > 0
            ? Math.round(((double) (interviews + offers) / submitted) * 1000.0) / 10.0
            : 0.0;
        double offerRate = submitted > 0
            ? Math.round(((double) offers / submitted) * 1000.0) / 10.0
            : 0.0;

        List<StatusCountDto> distribution = ORDERED_STATUSES.stream()
            .map(s -> new StatusCountDto(s, countStatus(apps, s)))
            .toList();

        Map<String, Long> monthCounts = new TreeMap<>();
        DateTimeFormatter ym = DateTimeFormatter.ofPattern("yyyy-MM");
        for (JobApplication app : apps) {
            if (app.getApplicationDate() != null) {
                monthCounts.merge(app.getApplicationDate().format(ym), 1L, Long::sum);
            }
        }
        List<TrendPointDto> monthlyTrends = monthCounts.entrySet().stream()
            .map(e -> new TrendPointDto(e.getKey(), e.getValue()))
            .toList();

        Map<String, long[]> companyAgg = new LinkedHashMap<>();
        for (JobApplication app : apps) {
            long[] counts = companyAgg.computeIfAbsent(app.getCompanyName(), k -> new long[3]);
            counts[0]++;
            if ("Interview".equals(app.getStatus())) counts[1]++;
            if ("Offered".equals(app.getStatus())) counts[2]++;
        }
        List<CompanyStatDto> companyStats = companyAgg.entrySet().stream()
            .map(e -> new CompanyStatDto(e.getKey(), e.getValue()[0], e.getValue()[1], e.getValue()[2]))
            .toList();

        return new AnalyticsSummaryResponse(
            total, applied, underReview, wishlist, interviews, offers, rejections,
            interviewRate, offerRate, distribution, monthlyTrends, monthlyTrends, companyStats
        );
    }

    private long countStatus(List<JobApplication> apps, String status) {
        return apps.stream().filter(a -> status.equalsIgnoreCase(a.getStatus())).count();
    }
}
