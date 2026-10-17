# Stage 1: Build
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy dependency files first for layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary — CGO disabled because modernc.org/sqlite is pure Go
RUN CGO_ENABLED=0 GOOS=linux go build -o ecopoint ./main.go

# Stage 2: Runtime
FROM alpine:3.20

WORKDIR /app

# ca-certificates for any HTTPS outbound calls
RUN apk add --no-cache ca-certificates

COPY --from=builder /app/ecopoint .

# Railway injects PORT automatically.
# Set DB_PATH and JWT_SECRET as Railway environment variables.
EXPOSE 8080

CMD ["./ecopoint"]
