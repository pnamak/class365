<?php
/**
 * Execute openSIS SQL dumps with MariaDB/PHP 8.
 *
 * The Classic dumps use `--SET ...` (no space after --) which MariaDB
 * treats as SQL, not a comment. They also use DELIMITER $$ for routines.
 */
declare(strict_types=1);

function class365_sql_line(string $line): ?string
{
    $line = preg_replace('/#.*$/', '', $line) ?? $line;
    $trim = ltrim($line);
    if ($trim === '' || str_starts_with($trim, '--')) {
        return null;
    }
    return $line;
}

function class365_exec_sql(mysqli $conn, string $stmt, string $path): void
{
    $stmt = trim($stmt);
    if ($stmt === '') {
        return;
    }
    // App DB users are not SUPER. Skip dump lines that require it.
    if (preg_match('/\bGLOBAL\b/i', $stmt) && preg_match('/\bSET\b/i', $stmt)) {
        echo '[class365] Skipping privileged SET in ' . basename($path) . PHP_EOL;
        return;
    }
    if (!$conn->query($stmt)) {
        throw new RuntimeException(
            'SQL error in ' . basename($path) . ': ' . $conn->error
            . ' near: ' . substr($stmt, 0, 160)
        );
    }
}

/**
 * @return int number of statements executed
 */
function class365_run_sql_file(mysqli $conn, string $path): int
{
    if (!is_readable($path)) {
        throw new RuntimeException("Missing SQL file: $path");
    }
    $sql = file_get_contents($path);
    if ($sql === false || trim($sql) === '') {
        return 0;
    }

    $delimiter = ';';
    $buffer = '';
    $count = 0;
    $lines = preg_split("/\r\n|\n|\r/", $sql) ?: [];

    foreach ($lines as $rawLine) {
        $line = class365_sql_line($rawLine);
        if ($line === null) {
            continue;
        }
        $trim = ltrim($line);
        if (preg_match('/^DELIMITER\s+(\S+)/i', $trim, $m)) {
            $pending = trim($buffer);
            if ($pending !== '') {
                class365_exec_sql($conn, $pending, $path);
                $count++;
            }
            $buffer = '';
            $delimiter = $m[1];
            continue;
        }

        $buffer .= $line . "\n";
        $trimmedBuf = rtrim($buffer);
        $delimLen = strlen($delimiter);
        if ($delimLen > 0 && substr($trimmedBuf, -$delimLen) === $delimiter) {
            $stmt = trim(substr($trimmedBuf, 0, -$delimLen));
            $buffer = '';
            if ($stmt !== '') {
                class365_exec_sql($conn, $stmt, $path);
                $count++;
            }
        }
    }

    $pending = trim($buffer);
    if ($pending !== '') {
        class365_exec_sql($conn, $pending, $path);
        $count++;
    }

    echo '[class365] Loaded ' . basename($path) . " ($count statements)" . PHP_EOL;
    return $count;
}

/**
 * Split a dump into statements without executing (for tests).
 *
 * @return list<string>
 */
function class365_split_sql_file(string $path): array
{
    $sql = file_get_contents($path);
    if ($sql === false) {
        return [];
    }
    $delimiter = ';';
    $buffer = '';
    $statements = [];
    $lines = preg_split("/\r\n|\n|\r/", $sql) ?: [];

    foreach ($lines as $rawLine) {
        $line = class365_sql_line($rawLine);
        if ($line === null) {
            continue;
        }
        $trim = ltrim($line);
        if (preg_match('/^DELIMITER\s+(\S+)/i', $trim, $m)) {
            $pending = trim($buffer);
            if ($pending !== '') {
                $statements[] = $pending;
            }
            $buffer = '';
            $delimiter = $m[1];
            continue;
        }
        $buffer .= $line . "\n";
        $trimmedBuf = rtrim($buffer);
        $delimLen = strlen($delimiter);
        if ($delimLen > 0 && substr($trimmedBuf, -$delimLen) === $delimiter) {
            $stmt = trim(substr($trimmedBuf, 0, -$delimLen));
            $buffer = '';
            if ($stmt !== '') {
                $statements[] = $stmt;
            }
        }
    }
    $pending = trim($buffer);
    if ($pending !== '') {
        $statements[] = $pending;
    }
    return $statements;
}
