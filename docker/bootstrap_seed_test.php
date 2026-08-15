<?php
declare(strict_types=1);

putenv('DB_HOST=127.0.0.1');
putenv('DB_PORT=3306');
putenv('DB_DATABASE=class365_seed_test');
putenv('DB_USERNAME=class365test');
putenv('DB_PASSWORD=class365test');
putenv('ADMIN_USERNAME=admin');
putenv('ADMIN_PASSWORD=admin123');

$root = new mysqli('127.0.0.1', 'class365test', 'class365test', '', 3306);
if ($root->connect_errno) {
    fwrite(STDERR, "cannot connect to MariaDB: {$root->connect_error}\n");
    exit(1);
}
$root->query('DROP DATABASE IF EXISTS class365_seed_test');
$root->query('CREATE DATABASE class365_seed_test CHARACTER SET utf8 COLLATE utf8_unicode_ci');
$root->close();

ob_start();
require __DIR__ . '/bootstrap.php';
$out = ob_get_clean();
if (!str_contains($out, 'Admin seed ready: admin / admin123')) {
    fwrite(STDERR, "bootstrap did not report admin123 seed\n$out\n");
    exit(1);
}

$conn = new mysqli('127.0.0.1', 'class365test', 'class365test', 'class365_seed_test', 3306);
$conn->set_charset('utf8');
$conn->query("SET NAMES utf8 COLLATE utf8_unicode_ci");

$auth = $conn->query('SELECT username, password, user_id, profile_id FROM login_authentication WHERE username="admin"');
$row = $auth ? $auth->fetch_assoc() : null;
if (!$row || !password_verify('admin123', $row['password'])) {
    fwrite(STDERR, "admin/admin123 hash did not verify\n");
    exit(1);
}
if (password_verify('demo123', $row['password'])) {
    fwrite(STDERR, "password unexpectedly still matches demo123\n");
    exit(1);
}

$joinSql = "SELECT PROFILE, STAFF_ID, CURRENT_SCHOOL_ID, FIRST_NAME, LAST_NAME, s.PROFILE_ID, IS_DISABLE, MAX(ssr.SYEAR) AS SYEAR
FROM staff s INNER JOIN staff_school_relationship ssr USING(staff_id), school_years sy
WHERE sy.school_id=s.current_school_id AND sy.syear=ssr.syear AND s.STAFF_ID=1";
$join = $conn->query($joinSql);
$login = $join ? $join->fetch_assoc() : null;
if (!$login || $login['STAFF_ID'] === null || $login['STAFF_ID'] === '') {
    fwrite(STDERR, "login JOIN did not return staff 1 after seed\n");
    exit(1);
}

$conn->query('DELETE FROM staff_school_relationship');
$conn->query('DELETE FROM school_years');
$broken = $conn->query($joinSql);
$brokenRow = $broken ? $broken->fetch_assoc() : null;
if ($brokenRow && $brokenRow['STAFF_ID'] !== null) {
    fwrite(STDERR, "expected NULL STAFF_ID after deleting school year relationship\n");
    exit(1);
}

class365_ensure_admin_seed(
    $conn,
    'Harbour Academy Port Vila',
    'Port Vila',
    'Shefa',
    'admin',
    'admin123',
    'Class',
    'Admin',
    'admin@class365.edu',
    (int) date('Y')
);
$fixed = $conn->query($joinSql);
$fixedRow = $fixed ? $fixed->fetch_assoc() : null;
if (!$fixedRow || $fixedRow['STAFF_ID'] === null || (int) $fixedRow['STAFF_ID'] !== 1) {
    fwrite(STDERR, "repair did not restore login JOIN\n");
    exit(1);
}

$auth = $conn->query('SELECT password FROM login_authentication WHERE username="admin"');
$hash = $auth->fetch_assoc()['password'] ?? '';
if (!password_verify('admin123', $hash)) {
    fwrite(STDERR, "repaired password is not admin123\n");
    exit(1);
}

try {
    $conn->query("UPDATE login_authentication SET LAST_LOGIN=CURRENT_TIMESTAMP, FAILED_LOGIN=0 WHERE USER_ID=1 AND PROFILE_ID=0");
} catch (Throwable $e) {
    fwrite(STDERR, "LAST_LOGIN update still fails: {$e->getMessage()}\n");
    exit(1);
}

echo "OK bootstrap_seed_test\n";
