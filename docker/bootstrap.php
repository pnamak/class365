<?php
/**
 * Class 365 Docker bootstrap — installs openSIS schema and Vanuatu school seed.
 */
declare(strict_types=1);

$host = getenv('DB_HOST') ?: 'db';
$port = (int) (getenv('DB_PORT') ?: 3306);
$db = getenv('DB_DATABASE') ?: 'class365';
$user = getenv('DB_USERNAME') ?: 'class365';
$pass = getenv('DB_PASSWORD') ?: 'class365pass';

$schoolName = getenv('SCHOOL_NAME') ?: 'Harbour Academy Port Vila';
$schoolCity = getenv('SCHOOL_CITY') ?: 'Port Vila';
$schoolState = getenv('SCHOOL_STATE') ?: 'Shefa';
$adminUser = getenv('ADMIN_USERNAME') ?: 'admin';
$adminPass = getenv('ADMIN_PASSWORD') ?: 'demo123';
$adminFirst = getenv('ADMIN_FIRST_NAME') ?: 'Class';
$adminLast = getenv('ADMIN_LAST_NAME') ?: 'Admin';
$adminEmail = getenv('ADMIN_EMAIL') ?: 'admin@class365.edu';
$syear = (int) date('Y');

function connect(string $host, string $user, string $pass, string $db, int $port): mysqli
{
    $conn = new mysqli($host, $user, $pass, $db, $port);
    if ($conn->connect_errno) {
        throw new RuntimeException('DB connect failed: ' . $conn->connect_error);
    }
    $conn->query("SET SESSION sql_mode = ''");
    $conn->set_charset('utf8');
    return $conn;
}

function runSqlFile(mysqli $conn, string $path): void
{
    if (!is_readable($path)) {
        throw new RuntimeException("Missing SQL file: $path");
    }
    $sql = file_get_contents($path);
    if ($sql === false || trim($sql) === '') {
        return;
    }
    $sql = preg_replace('/^DELIMITER .*$/mi', '', $sql) ?? $sql;

    if (!$conn->multi_query($sql)) {
        throw new RuntimeException("SQL error in $path: " . $conn->error);
    }
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());

    if ($conn->errno) {
        throw new RuntimeException("SQL error after $path: " . $conn->error);
    }
    echo "[class365] Loaded " . basename($path) . PHP_EOL;
}

echo "[class365] Connecting to {$host}:{$port}/{$db}" . PHP_EOL;
$conn = connect($host, $user, $pass, $db, $port);

$installed = false;
$check = $conn->query("SHOW TABLES LIKE 'login_authentication'");
if ($check && $check->num_rows > 0) {
    $installed = true;
}
if ($check) {
    $check->free();
}

if ($installed) {
    echo "[class365] Schema already present — skipping fresh install." . PHP_EOL;
} else {
    $base = __DIR__ . '/../install';
    runSqlFile($conn, $base . '/OpensisSchemaMysqlInc.sql');
    runSqlFile($conn, $base . '/OpensisProcsMysqlInc.sql');
    if (is_readable($base . '/OpensisTriggerMysqlInc.sql')) {
        try {
            runSqlFile($conn, $base . '/OpensisTriggerMysqlInc.sql');
        } catch (Throwable $e) {
            echo "[class365] Trigger load warning: " . $e->getMessage() . PHP_EOL;
        }
    }

    $conn->query("INSERT INTO app (`name`, `value`) VALUES
        ('version', '9.3'),
        ('date', '" . $conn->real_escape_string(date('F d, Y')) . "'),
        ('build', 'class365'),
        ('update', '0'),
        ('last_updated', '" . $conn->real_escape_string(date('F d, Y')) . "')");

    // Super-admin profile id 0 (openSIS convention)
    $conn->query("SET sql_mode=''");
    $conn->query("INSERT INTO user_profiles (id, profile, title) VALUES
        (0, 'admin', 'Super Administrator')");
    $conn->query("INSERT INTO user_profiles (id, profile, title) VALUES
        (1, 'admin', 'Administrator'),
        (2, 'teacher', 'Teacher'),
        (3, 'student', 'Student'),
        (4, 'parent', 'Parent')");

    $sn = $conn->real_escape_string($schoolName);
    $city = $conn->real_escape_string($schoolCity);
    $state = $conn->real_escape_string($schoolState);
    $conn->query("INSERT INTO schools (id, syear, title, address, city, state, zipcode, phone, e_mail, reporting_gp_scale)
        VALUES (1, {$syear}, '{$sn}', 'Kumul Highway', '{$city}', '{$state}', 'VU', '+678 22000', 'office@class365.edu', 4.000)");

    $conn->query("INSERT INTO school_years (marking_period_id, syear, school_id, title, short_name, sort_order, start_date, end_date, does_grades)
        VALUES (1, {$syear}, 1, 'Full Year', 'FY', 1, '{$syear}-01-01', '{$syear}-12-31', 'Y')");

    $af = $conn->real_escape_string($adminFirst);
    $al = $conn->real_escape_string($adminLast);
    $ae = $conn->real_escape_string($adminEmail);
    $au = $conn->real_escape_string($adminUser);
    $hashEsc = $conn->real_escape_string(password_hash($adminPass, PASSWORD_DEFAULT));

    $conn->query("INSERT INTO staff (staff_id, current_school_id, title, first_name, last_name, email, profile, profile_id)
        VALUES (1, 1, 'Ms', '{$af}', '{$al}', '{$ae}', 'admin', 0)");

    $conn->query("INSERT INTO login_authentication (id, user_id, profile_id, username, password, failed_login)
        VALUES (1, 1, 0, '{$au}', '{$hashEsc}', 0)");

    $conn->query("INSERT INTO staff_school_info (staff_id, category, job_title, home_school, opensis_access, opensis_profile, school_access)
        VALUES (1, 'Admin', 'Registrar', 1, 'Y', 'admin', ',1,')");

    $conn->query("INSERT INTO staff_school_relationship (staff_id, school_id, syear, start_date)
        VALUES (1, 1, {$syear}, '{$syear}-01-01')");

    $msg = $conn->real_escape_string(
        'Welcome to Class 365 — Harbour Academy Port Vila, Vanuatu. Fees and reports use Vanuatu Vatu (VT).'
    );
    $conn->query("INSERT INTO login_message (id, message, display) VALUES (1, '{$msg}', 'Y')");

    $conn->query("INSERT INTO program_config (syear, school_id, program, title, value) VALUES
        ({$syear}, NULL, 'Currency', 'Vanuatu Vatu (VUV)', '1'),
        ({$syear}, 1, 'UPDATENOTIFY', 'display', 'Y'),
        ({$syear}, 1, 'UPDATENOTIFY', 'display_school', 'Y')");

    $conn->query("INSERT INTO program_user_config (user_id, school_id, program, title, value) VALUES
        (1, NULL, 'Preferences', 'THEME', 'blue'),
        (1, NULL, 'Preferences', 'CURRENCY', '1'),
        (1, NULL, 'Preferences', 'HIDDEN', 'Y')");

    $conn->query("INSERT INTO system_preference_misc (fail_count, activity_days, system_maintenance_switch)
        VALUES (5, 30, 'N')");

    $grades = [
        [1, 'K', 'Kindy', 2],
        [2, 'Y1', 'Year 1', 3],
        [3, 'Y2', 'Year 2', 4],
        [4, 'Y3', 'Year 3', 5],
        [5, 'Y4', 'Year 4', 6],
        [6, 'Y5', 'Year 5', 7],
        [7, 'Y6', 'Year 6', 8],
        [8, 'Y7', 'Year 7', 9],
        [9, 'Y8', 'Year 8', 10],
        [10, 'Y9', 'Year 9', 11],
        [11, 'Y10', 'Year 10', 12],
        [12, 'Y11', 'Year 11', 13],
        [13, 'Y12', 'Year 12', 14],
        [14, 'Y13', 'Year 13', null],
    ];
    foreach ($grades as $i => [$id, $short, $title, $next]) {
        $sort = $i + 1;
        $nextSql = $next === null ? 'NULL' : (string) $next;
        $conn->query("INSERT INTO school_gradelevels (id, school_id, short_name, title, next_grade_id, sort_order)
            VALUES ({$id}, 1, '{$short}', '{$title}', {$nextSql}, {$sort})");
    }

    $conn->query("INSERT INTO school_calendars (school_id, title, syear, calendar_id, default_calendar, days)
        VALUES (1, 'Main Calendar {$syear}', {$syear}, 1, 'Y', 'MTWHF')");

    echo "[class365] Fresh Class 365 install complete." . PHP_EOL;
    echo "[class365] Admin login: {$adminUser} / {$adminPass}" . PHP_EOL;
}

// Keep school branding current on every boot
$sn = $conn->real_escape_string($schoolName);
$city = $conn->real_escape_string($schoolCity);
$state = $conn->real_escape_string($schoolState);
$conn->query("UPDATE schools SET title='{$sn}', city='{$city}', state='{$state}' WHERE id=1");

// Ensure admin password matches env on every boot (demo convenience)
$au = $conn->real_escape_string($adminUser);
$hashEsc = $conn->real_escape_string(password_hash($adminPass, PASSWORD_DEFAULT));
$conn->query("UPDATE login_authentication SET username='{$au}', password='{$hashEsc}', failed_login=0 WHERE user_id=1 AND profile_id=0");

$conn->close();
echo "[class365] Bootstrap finished." . PHP_EOL;
