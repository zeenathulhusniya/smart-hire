CREATE DATABASE IF NOT EXISTS smart_hire_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_hire_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(40),
    city VARCHAR(120) DEFAULT 'Colombo, Sri Lanka',
    target_role VARCHAR(120),
    experience_level VARCHAR(40) DEFAULT 'Internship',
    bio TEXT,
    skills TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    preferred_language VARCHAR(10) DEFAULT 'en',
    email_reminders_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    interview_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    deadline_alerts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
);

CREATE TABLE IF NOT EXISTS job_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(140) NOT NULL,
    job_title VARCHAR(180) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    salary VARCHAR(100),
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
    employment_type VARCHAR(40) NOT NULL,
    experience_level VARCHAR(40) NOT NULL,
    required_skills TEXT,
    remote_status VARCHAR(30) NOT NULL,
    eligible_countries VARCHAR(255) NOT NULL,
    sri_lanka_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    job_source VARCHAR(120) NOT NULL,
    original_url VARCHAR(500) NOT NULL UNIQUE,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    last_verified_at TIMESTAMP NULL,
    posted_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_jobs_verified_sl (verification_status, remote_status, sri_lanka_eligible, expiry_date),
    INDEX idx_jobs_category (category)
);

CREATE TABLE IF NOT EXISTS job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(140) NOT NULL,
    job_title VARCHAR(180) NOT NULL,
    location VARCHAR(140) DEFAULT 'Fully Remote (Sri Lanka)',
    salary VARCHAR(100),
    application_date DATE NOT NULL,
    job_url VARCHAR(500),
    job_description TEXT,
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Applied',
    follow_up_date DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_app_user_status (user_id, status),
    INDEX idx_app_date (application_date)
);

CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company VARCHAR(140) NOT NULL,
    job_title VARCHAR(180) NOT NULL,
    interview_date DATE NOT NULL,
    interview_time VARCHAR(20) NOT NULL,
    interview_type VARCHAR(40) NOT NULL,
    meeting_link VARCHAR(500),
    notes TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_interview_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_interview_user_date (user_id, interview_date)
);

CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    reminder_type VARCHAR(40) NOT NULL,
    due_date DATE NOT NULL,
    due_time VARCHAR(20) NOT NULL,
    related_company VARCHAR(140),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reminder_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reminder_user_completed (user_id, completed, due_date)
);

CREATE TABLE IF NOT EXISTS resume_analyses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    target_role VARCHAR(180) NOT NULL,
    match_score INT NOT NULL,
    matched_skills TEXT,
    missing_skills TEXT,
    strengths TEXT,
    improvement_suggestions TEXT,
    recommended_learning_areas TEXT,
    extracted_preview TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_resume_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_resume_user (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_user_time (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_job FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_saved_job (user_id, job_id)
);
