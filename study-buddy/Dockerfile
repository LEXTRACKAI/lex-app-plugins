# Use official nginx image as base
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy application files
COPY index.html .
COPY style.css .
COPY script.js .
COPY api.js .
COPY config.js .

# Copy custom nginx configuration (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S studybuddy -u 1001

# Set proper permissions
RUN chown -R studybuddy:nodejs /usr/share/nginx/html && \
    chown -R studybuddy:nodejs /var/cache/nginx && \
    chown -R studybuddy:nodejs /var/log/nginx && \
    chown -R studybuddy:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER studybuddy

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]