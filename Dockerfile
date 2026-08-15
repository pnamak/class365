FROM php:8.2-apache-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libzip-dev \
        libicu-dev \
        mariadb-client \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        mysqli \
        pdo_mysql \
        gd \
        zip \
        intl \
        opcache \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# Allow .htaccess overrides for openSIS
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

WORKDIR /var/www/html

COPY . /var/www/html

# Writable paths used by openSIS install / uploads
RUN mkdir -p /var/www/html/assets/studentfiles \
        /var/www/html/assets/stafffiles \
        /var/www/html/Backups \
    && chown -R www-data:www-data /var/www/html \
    && chmod +x /var/www/html/docker/entrypoint.sh

ENV APACHE_DOCUMENT_ROOT=/var/www/html
EXPOSE 80

ENTRYPOINT ["/var/www/html/docker/entrypoint.sh"]
CMD ["apache2-foreground"]
