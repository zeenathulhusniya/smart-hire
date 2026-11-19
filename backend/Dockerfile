# Stage 1: Build with Maven & Java 21
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight Java 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S smarthire && adduser -S smarthire -G smarthire
USER smarthire
COPY --from=builder /app/target/smart-hire-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
