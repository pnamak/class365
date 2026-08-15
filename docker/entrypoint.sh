#!/bin/bash
set -euo pipefail

echo "[class365] Starting Class 365 (openSIS) entrypoint..."

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"
DB_DATABASE="${DB_DATABASE:-class365}"
DB_USERNAME="${DB_USERNAME:-class365}"
DB_PASSWORD="${DB_PASSWORD:-class365pass}"
AUTO_INSTALL="${AUTO_INSTALL:-true}"

wait_for_db() {
  echo "[class365] Waiting for database ${DB_HOST}:${DB_PORT}..."
  for i in $(seq 1 60); do
    if mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent 2>/dev/null; then
      echo "[class365] Database is ready."
      return 0
    fi
    sleep 2
  done
  echo "[class365] Database did not become ready in time." >&2
  return 1
}

write_data_php() {
  cat >/var/www/html/Data.php <<EOF
<?php
\$DatabaseType = 'mysqli';
\$DatabaseServer = '${DB_HOST}';
\$DatabaseUsername = '${DB_USERNAME}';
\$DatabasePassword = '${DB_PASSWORD}';
\$DatabaseName = '${DB_DATABASE}';
\$DatabasePort = '${DB_PORT}';
EOF
  chown www-data:www-data /var/www/html/Data.php
  echo "[class365] Wrote Data.php"
}

if [ "$AUTO_INSTALL" = "true" ]; then
  # Never block Apache forever — log bootstrap failures and still serve HTTP
  # so Coolify healthchecks / Traefik can reach the container during recovery.
  if wait_for_db; then
    write_data_php
    php /var/www/html/docker/bootstrap.php || echo "[class365] Bootstrap failed (continuing)" >&2
  else
    write_data_php
    echo "[class365] Database not ready — starting Apache anyway" >&2
  fi
fi

# Ensure writable dirs
chown -R www-data:www-data /var/www/html/assets /var/www/html/Backups 2>/dev/null || true

echo "[class365] Launching Apache..."
exec docker-php-entrypoint "$@"
