# Use official OpenJDK 21 image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for caching dependencies)
COPY mvnw .
COPY pom.xml .
COPY .mvn/ .mvn/

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies only (Docker layer caching)
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the project
COPY src/ src/

# Build the project
RUN ./mvnw clean package -DskipTests

# Expose port 8080 (Spring Boot default)
EXPOSE 8080

# Set environment variable for Render
ENV PORT=8080

# Run the Spring Boot jar
CMD ["java", "-jar", "target/resume-assistant-0.0.1-SNAPSHOT.jar"]
