# Smart Hire — Java 21 Spring Boot Backend Tamil Guide & Cloud Deployment Manual

## 1. Seven Internship Requirements Evidence

1. **Front-End Development:** React 19 + TypeScript + Tailwind CSS + React Router DOM with 15 responsive pages (`/`, `/login`, `/register`, `/dashboard`, `/jobs`, `/jobs/:id`, `/applications`, `/analytics`, `/resume-analyzer`, `/career-assistant`, `/interviews`, `/reminders`, `/saved-jobs`, `/profile`, `/settings`).
2. **Back-End Development / REST APIs:** Java 21 + Spring Boot 3.3.5 MVC Controllers, Service Layer with constructor injection, Bean Validation (`@Valid`), GlobalExceptionHandler, Swagger UI (`/swagger-ui.html`).
3. **Database Integration & Management:** MySQL 8 normalized schema (`schema.sql`) with 8 tables (`users`, `job_listings`, `job_applications`, `interviews`, `reminders`, `resume_analyses`, `chat_messages`, `saved_jobs`), foreign keys, unique constraints, and indexes.
4. **Web Server / Application Server Configuration:** Embedded Tomcat on port 8080 (`application.properties`, `application-dev.properties`, `application-prod.properties`), CORS configuration, and `/api/health` endpoint.
5. **Cloud Deployment & Hosting:** Multi-stage `backend/Dockerfile` (`eclipse-temurin:21-jre-alpine`), `docker-compose.yml` for MySQL 8 + Spring Boot, `vercel.json` for frontend SPA routing.
6. **Application Configuration & Environment Setup:** Externalized secrets via environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `GEMINI_API_KEY`, `VITE_API_BASE_URL`).
7. **Integration of All Components:** React `src/services/*.ts` communicates with Spring Boot REST APIs via JWT `Authorization: Bearer <token>`, while `GeminiService.java` handles AI Resume Analysis and Bilingual Career Assistant securely on the server.

---

## 2. Java Backend File-by-File Simple Tamil Explanation (தமிழ் விளக்கம்)

### A. `SmartHireApplication.java` (`backend/src/main/java/lk/smarthire/SmartHireApplication.java`)
1. **Purpose (நோக்கம்):** Spring Boot application-ஐத் தொடங்கும் பிரதான (main) Java file.
2. **Why needed:** Embedded Tomcat server மற்றும் அனைத்து Beans-களையும் start செய்யத் தேவை.
3. **Important Imports:** `SpringApplication`, `@SpringBootApplication`, `@EnableScheduling`.
4. **Annotations:**
   - `@SpringBootApplication`: Auto-configuration மற்றும் component scanning-ஐ இயக்கும்.
   - `@EnableScheduling`: காலாவதியான வேலைகளை (`archiveExpiredListings`) தினமும் தானாக நீக்க/archive செய்ய உதவும்.
5. **Line-by-line & Flow:** `main()` method-க்குள் `SpringApplication.run(SmartHireApplication.class, args)` Spring container-ஐ start செய்கிறது.
6. **Run & Test:** `mvn spring-boot:run`
7. **Common Error:** Port 8080 ஏற்கனவே பயன்பாட்டில் இருந்தால் (`Port 8080 already in use`), `PORT=8081` என மாற்றவும் அல்லது பழைய process-ஐ stop செய்யவும்.

### B. `User.java` & `JobListing.java` (`backend/src/main/java/lk/smarthire/entity/`)
1. **Purpose:** MySQL database tables (`users`, `job_listings`) மற்றும் Java objects-க்கு இடையேயான Hibernate JPA mapping.
2. **Why needed:** SQL code எழுதாமலேயே Java objects வழியாக database-இல் data save/read செய்ய.
3. **Annotations:** `@Entity`, `@Table(name = "...")`, `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`, `@Column`, `@Enumerated(EnumType.STRING)`.
4. **Key Fields in `JobListing`:** `remoteStatus` (`FULLY_REMOTE`), `sriLankaEligible` (`boolean`), `verificationStatus` (`VERIFIED`), `originalUrl` (unique), `expiryDate`, `lastVerifiedAt`.
5. **Common Error:** `ddl-auto=validate` இருக்கும்போது MySQL table column பெயரும் Entity `@Column(name=...)` பெயரும் பொருந்தாவிட்டால் startup error வரும்; `schema.sql`-ஐ முதலில் run செய்யவும்.

### C. `JobListingRepository.java` & Other Repositories (`backend/src/main/java/lk/smarthire/repository/`)
1. **Purpose:** Spring Data JPA மூலம் MySQL queries-ஐ இயக்குவது.
2. **Key Query:** `findAllVerifiedSriLankaRemoteJobs` — இது `verificationStatus = 'VERIFIED'`, `remoteStatus = 'FULLY_REMOTE'`, `sriLankaEligible = true`, மற்றும் `expiryDate >= TODAY` ஆகியவற்றை மட்டும் return செய்யும்.
3. **Common Error:** JPQL query-இல் table name அல்ல, Entity class name (`JobListing`) பயன்படுத்த வேண்டும்.

### D. `JwtService.java`, `JwtAuthenticationFilter.java`, `SecurityConfig.java`
1. **Purpose:** BCrypt password hashing + Stateless JWT Token பாதுகாப்பு.
2. **How they communicate:**
   - பயனர் login செய்யும்போது `AuthService` password-ஐ BCrypt மூலம் சரிபார்த்து `JwtService.generateToken()` வழியாக JWT token தரும்.
   - ஒவ்வொரு API request-லும் `JwtAuthenticationFilter` `Authorization: Bearer <token>` header-ஐப் படித்து `SecurityContextHolder`-இல் user-ஐ அமைக்கும்.
   - `SecurityConfig` `/api/health`, `/api/auth/**`, மற்றும் `GET /api/jobs/verified` ஆகியவற்றை public ஆக்கி, மற்ற user endpoints-ஐ பாதுகாக்கும்.
3. **Common Error:** `JWT_SECRET` 32 characters-க்கு குறைவாக இருந்தால் startup-இல் `IllegalStateException` வரும்.

### E. `JobIngestionVerificationService.java` (`backend/src/main/java/lk/smarthire/service/JobIngestionVerificationService.java`)
1. **Purpose:** Smart Hire-இன் மிக முக்கியமான business rule-ஐச் செயல்படுத்துவது — **Fully Remote + Sri Lanka Eligible + Non-Expired + Non-Duplicate** வேலைகளை மட்டுமே MySQL-இல் சேமிப்பது.
2. **Methods:**
   - `verifyAndIngestCandidate()`: `HYBRID`/`ONSITE` அல்லது பிற நாடுகளுக்கு மட்டுமே உள்ள வேலைகளை நிராகரிக்கும் (`Optional.empty()`).
   - `isSriLankaEligible()`: `Sri Lanka`, `Worldwide`, `Global` உள்ளதா எனச் சரிபார்க்கும்.
   - `archiveExpiredListings()`: `@Scheduled(cron = "0 0 2 * * *")` மூலம் தினமும் அதிகாலை 2 மணிக்கு காலாவதியான வேலைகளை `EXPIRED` என மாற்றும்.

### F. `GeminiService.java`, `ResumeAnalysisService.java`, `CareerAssistantService.java`
1. **Purpose:** Google Gemini API-ஐ Java backend வழியாக மட்டுமே அழைப்பது (`GEMINI_API_KEY` React-க்கு ஒருபோதும் செல்லாது).
2. **How `ResumeAnalysisService` works:**
   - Upload செய்த file `.pdf` மற்றும் `<= 5MB` உள்ளதா என `validatePdf()` சரிபார்க்கும்.
   - `Apache PDFBox` (`Loader.loadPDF`) மூலம் PDF-இலிருந்து text-ஐப் பிரித்தெடுக்கும்.
   - `GeminiService.generateText()` மூலம் JSON format-இல் `matchScore`, `matchedSkills`, `missingSkills`, `strengths`, `improvementSuggestions`, `recommendedLearningAreas` பெற்று MySQL `resume_analyses` table-இல் சேமிக்கும்.
3. **Common Error:** `GEMINI_API_KEY` set செய்யாமல் call செய்தால் `IllegalStateException` வரும்.

### G. Controllers (`AuthController`, `JobListingController`, `JobApplicationController`, `AnalyticsController`, `ResumeAnalysisController`, `CareerAssistantController`, `InterviewController`, `ReminderController`, `SavedJobController`, `HealthController`)
1. **Purpose:** Frontend React HTTP requests (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) பெற்று Service layer-க்கு அனுப்புவது.
2. **Testing with Swagger & Postman:**
   - Backend run ஆன பிறகு `http://localhost:8080/swagger-ui.html` திறந்து அனைத்து endpoints-களையும் test செய்யலாம்.
   - Postman-இல் முதலில் `POST /api/auth/register` அல்லது `POST /api/auth/login` அனுப்பி கிடைக்கும் `token`-ஐ `Authorization -> Bearer Token`-இல் கொடுத்து `/api/applications`, `/api/analytics/summary`, `/api/resume/analyze` ஆகியவற்றை test செய்யவும்.

---

## 3. Local Run & Cloud Deployment Instructions

### Step 1: Run Backend Tests (H2 In-Memory DB)
```bash
cd backend
mvn test
```

### Step 2: Run with Docker Compose (MySQL 8 + Java 21 Spring Boot)
```bash
cd backend
cp .env.example .env
# Edit .env with strong MYSQL_ROOT_PASSWORD, JWT_SECRET (32+ chars), GEMINI_API_KEY
docker compose up --build
```
Verify health check: `curl http://localhost:8080/api/health`

### Step 3: Cloud Deployment
- **Database:** Provision a Managed MySQL 8 instance (Railway, Aiven, PlanetScale/RDS) and execute `backend/src/main/resources/schema.sql`.
- **Java Backend:** Deploy `backend/Dockerfile` to Render, Railway, Google Cloud Run, or Fly.io with env vars `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `GEMINI_API_KEY`, `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`.
- **Frontend:** Deploy root Vite React project to Vercel or Netlify (`npm run build`, output `dist/`), setting `VITE_API_BASE_URL=https://your-backend-domain/api`.
