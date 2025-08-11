FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY index.html .
COPY style.css .
COPY script.js .
COPY api.js .
COPY config.js .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]