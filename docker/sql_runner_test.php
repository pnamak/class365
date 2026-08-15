<?php
declare(strict_types=1);
require_once __DIR__ . '/sql_runner.php';

$schema = dirname(__DIR__) . '/install/OpensisSchemaMysqlInc.sql';
$procs = dirname(__DIR__) . '/install/OpensisProcsMysqlInc.sql';

$statements = class365_split_sql_file($schema);
if ($statements === []) {
    fwrite(STDERR, "schema produced no statements\n");
    exit(1);
}

$first = $statements[0];
if (str_contains($first, 'SQL_MODE="NO_AUTO_VALUE_ON_ZERO"') || str_starts_with(ltrim($first), '--')) {
    fwrite(STDERR, "SQL_MODE comment leaked into executable SQL:\n$first\n");
    exit(1);
}
$hasAppTable = false;
$hasSeparateMailAlter = false;
foreach ($statements as $stmt) {
    if (preg_match('/^CREATE TABLE\s+app\b/i', $stmt)) {
        $hasAppTable = true;
    }
    if (preg_match('/^ALTER TABLE `mail_groupmembers`/i', $stmt)) {
        $hasSeparateMailAlter = true;
    }
    if (preg_match('/CREATE TABLE.*ALTER TABLE/is', $stmt)) {
        fwrite(STDERR, "CREATE and ALTER were glued together\n");
        exit(1);
    }
}
if (!$hasSeparateMailAlter) {
    fwrite(STDERR, "mail_groupmembers ALTER was not split out\n");
    exit(1);
}
if (!$hasAppTable) {
    fwrite(STDERR, "schema dump did not yield CREATE TABLE app\n");
    exit(1);
}

$joined = implode("\n", $statements);
if (str_contains($joined, '--SET SQL_MODE')) {
    fwrite(STDERR, "comment line leaked into executable SQL\n");
    exit(1);
}

$procStatements = class365_split_sql_file($procs);
$hasFunction = false;
foreach ($procStatements as $stmt) {
    if (preg_match('/^CREATE FUNCTION/i', $stmt)) {
        $hasFunction = true;
        if (!str_contains($stmt, 'BEGIN') || !str_contains($stmt, 'END')) {
            fwrite(STDERR, "function body was split incorrectly\n");
            exit(1);
        }
        break;
    }
}
if (!$hasFunction) {
    fwrite(STDERR, "procs dump did not yield a CREATE FUNCTION statement\n");
    exit(1);
}

echo 'OK schema_statements=' . count($statements) . ' proc_statements=' . count($procStatements) . PHP_EOL;
