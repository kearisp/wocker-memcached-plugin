# Використовуємо офіційний образ PHP з Apache
FROM php:8.2-apache

ARG MEMCACHE_ENABLE=true
RUN if [ "$MEMCACHE_ENABLE" = "true" ]; then \
        apt-get update && apt-get install -y \
            zlib1g-dev \
            libmemcached-dev && \
        pecl install memcache && docker-php-ext-enable memcache; \
    fi

ARG MEMCACHED_ENABLE=true
RUN if [ "$MEMCACHED_ENABLE" = "true" ]; then \
        apt-get update && apt-get install -y \
            libcurl4-openssl-dev  \
            libssl-dev \
            libmemcached-dev \
            zlib1g-dev && \
        pecl install memcached && docker-php-ext-enable memcached; \
    fi

## Встановлюємо необхідні пакети для PHP та Memcached
#RUN apt-get update && apt-get install -y \
#    libmemcached-dev \
#    zlib1g-dev \
#    && docker-php-ext-install opcache \
#    && pecl install memcached \
#    && docker-php-ext-enable memcached

# Завантажуємо phpMemcachedAdmin
RUN apt-get install -y git && \
    git clone https://github.com/elijaa/phpmemcachedadmin.git /var/www/html/phpmemcachedadmin

ENV COMPOSER_ALLOW_SUPERUSER=1

# Встановлюємо права на файли
RUN chown -R www-data:www-data /var/www/html/phpmemcachedadmin && \
    cd /var/www/html/phpmemcachedadmin/Config && \
    mv ./Memcache.sample.php ./Memcache.php && \
    chmod -R 755 /var/www/html/phpmemcachedadmin

RUN apt-get update && \
    apt-get install -y bash-completion; \
    echo "source /etc/bash_completion" >> /home/$USER/.bashrc; \
    mkdir -p /home/$USER/.composer; \
    curl -sL https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    chmod +x /usr/local/bin/composer; \
    echo ". <(composer completion bash)" >> /home/$USER/.bashrc; \
    cd /var/www/html/phpmemcachedadmin; \
    composer install

# Копіюємо скрипт налаштування
COPY ./config-entrypoint.sh /usr/local/bin/config-entrypoint.sh
RUN chmod +x /usr/local/bin/config-entrypoint.sh

# Встановлюємо базову конфігурацію Apache
COPY ./apache-config.conf /etc/apache2/sites-available/000-default.conf

# Відкриваємо порт
EXPOSE 80

# Запускаємо скрипт конфігурації перед запуском Apache
ENTRYPOINT ["/usr/local/bin/config-entrypoint.sh"]
CMD ["apache2-foreground"]

