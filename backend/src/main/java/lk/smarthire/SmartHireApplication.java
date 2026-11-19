package lk.smarthire;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartHireApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartHireApplication.class, args);
    }
}
