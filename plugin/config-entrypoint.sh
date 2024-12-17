#!/bin/bash

# Оновлюємо конфігураційний файл Memcache.php
sed -i "s/'127.0.0.1'/'${MEMCACHED_HOST:-127.0.0.1}'/" /var/www/html/phpmemcachedadmin/Config/Memcache.php

# Запускаємо Apache
exec "$@"

