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
$adminPass = getenv('ADMIN_PASSWORD') ?: 'admin123';
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
    $conn->query("SET SESSION sql_mode = 'NO_AUTO_VALUE_ON_ZERO'");
    $conn->set_charset('utf8');
    $conn->query("SET NAMES utf8 COLLATE utf8_unicode_ci");
    return $conn;
}

require_once __DIR__ . '/sql_runner.php';

function runSqlFile(mysqli $conn, string $path): void
{
    class365_run_sql_file($conn, $path);
}

function class365_must_query(mysqli $conn, string $sql, string $label): void
{
    if (!$conn->query($sql)) {
        throw new RuntimeException($label . ': ' . $conn->error);
    }
}

/**
 * Always repair the rows the login JOIN needs: profile 0, school year,
 * staff 1, login_authentication, and staff_school_relationship for the
 * current year. A half-finished first boot previously left admin/demo123
 * able to verify the password while STAFF_ID stayed empty.
 */
function class365_ensure_admin_seed(
    mysqli $conn,
    string $schoolName,
    string $schoolCity,
    string $schoolState,
    string $adminUser,
    string $adminPass,
    string $adminFirst,
    string $adminLast,
    string $adminEmail,
    int $syear
): void {
    $conn->query("SET SESSION sql_mode = 'NO_AUTO_VALUE_ON_ZERO'");
    $conn->query("SET NAMES utf8 COLLATE utf8_unicode_ci");

    $sn = $conn->real_escape_string($schoolName);
    $city = $conn->real_escape_string($schoolCity);
    $state = $conn->real_escape_string($schoolState);
    $af = $conn->real_escape_string($adminFirst);
    $al = $conn->real_escape_string($adminLast);
    $ae = $conn->real_escape_string($adminEmail);
    $au = $conn->real_escape_string($adminUser);
    $hashEsc = $conn->real_escape_string(password_hash($adminPass, PASSWORD_DEFAULT));
    $msg = $conn->real_escape_string(
        'Welcome to Class 365 — Harbour Academy Port Vila, Vanuatu. Fees and reports use Vanuatu Vatu (VT).'
    );

    class365_must_query($conn, "INSERT IGNORE INTO app (`name`, `value`) VALUES
        ('version', '9.3'),
        ('date', '" . $conn->real_escape_string(date('F d, Y')) . "'),
        ('build', '" . $conn->real_escape_string(date('mdY') . '001') . "'),
        ('update', '0'),
        ('last_updated', '" . $conn->real_escape_string(date('F d, Y')) . "')", 'app seed');

    class365_must_query($conn, "INSERT IGNORE INTO user_profiles (id, profile, title) VALUES
        (0, 'admin', 'Super Administrator')", 'super admin profile');
    class365_must_query($conn, "INSERT IGNORE INTO user_profiles (id, profile, title) VALUES
        (1, 'admin', 'Administrator'),
        (2, 'teacher', 'Teacher'),
        (3, 'student', 'Student'),
        (4, 'parent', 'Parent')", 'user profiles');

    class365_must_query($conn, "INSERT IGNORE INTO schools (id, syear, title, address, city, state, zipcode, phone, e_mail, reporting_gp_scale)
        VALUES (1, {$syear}, '{$sn}', 'Kumul Highway', '{$city}', '{$state}', 'VU', '+678 22000', 'office@class365.edu', 4.000)", 'school');
    class365_must_query($conn, "UPDATE schools SET title='{$sn}', city='{$city}', state='{$state}', syear={$syear} WHERE id=1", 'school branding');

    $yearExists = $conn->query("SELECT 1 FROM school_years WHERE school_id=1 AND syear={$syear} LIMIT 1");
    if (!$yearExists || $yearExists->num_rows === 0) {
        class365_must_query($conn, "INSERT INTO school_years (marking_period_id, syear, school_id, title, short_name, sort_order, start_date, end_date, does_grades)
            VALUES (1, {$syear}, 1, 'Full Year', 'FY', 1, '{$syear}-01-01', '{$syear}-12-31', 'Y')", 'school year');
    } else {
        class365_must_query($conn, "UPDATE school_years SET start_date='{$syear}-01-01', end_date='{$syear}-12-31'
            WHERE school_id=1 AND syear={$syear}", 'school year dates');
    }
    if ($yearExists) {
        $yearExists->free();
    }

    $staffExists = $conn->query("SELECT staff_id FROM staff WHERE staff_id=1 LIMIT 1");
    if ($staffExists && $staffExists->num_rows > 0) {
        class365_must_query($conn, "UPDATE staff SET current_school_id=1, title='Ms', first_name='{$af}', last_name='{$al}',
            email='{$ae}', profile='admin', profile_id=0, is_disable=NULL WHERE staff_id=1", 'staff update');
    } else {
        class365_must_query($conn, "INSERT INTO staff (staff_id, current_school_id, title, first_name, last_name, email, profile, profile_id, is_disable)
            VALUES (1, 1, 'Ms', '{$af}', '{$al}', '{$ae}', 'admin', 0, NULL)", 'staff insert');
    }
    if ($staffExists) {
        $staffExists->free();
    }

    // UPDATE fires tu_login_authentication, which compares usernames across
    // mixed utf8_unicode_ci / utf8_general_ci columns and fatals the seed.
    class365_must_query($conn, "DELETE FROM login_authentication WHERE user_id=1 AND profile_id=0", 'login delete');
    class365_must_query($conn, "INSERT INTO login_authentication (user_id, profile_id, username, password, failed_login)
        VALUES (1, 0, '{$au}', '{$hashEsc}', 0)", 'login insert');

    $infoExists = $conn->query("SELECT staff_id FROM staff_school_info WHERE staff_id=1 LIMIT 1");
    if ($infoExists && $infoExists->num_rows > 0) {
        class365_must_query($conn, "UPDATE staff_school_info SET category='Admin', job_title='Registrar', home_school=1,
            opensis_access='Y', opensis_profile='admin', school_access=',1,' WHERE staff_id=1", 'staff_school_info update');
    } else {
        class365_must_query($conn, "INSERT INTO staff_school_info (staff_id, category, job_title, home_school, opensis_access, opensis_profile, school_access)
            VALUES (1, 'Admin', 'Registrar', 1, 'Y', 'admin', ',1,')", 'staff_school_info insert');
    }
    if ($infoExists) {
        $infoExists->free();
    }

    $relExists = $conn->query("SELECT staff_id FROM staff_school_relationship WHERE staff_id=1 AND school_id=1 AND syear={$syear} LIMIT 1");
    if ($relExists && $relExists->num_rows > 0) {
        class365_must_query($conn, "UPDATE staff_school_relationship SET start_date='{$syear}-01-01', end_date=NULL
            WHERE staff_id=1 AND school_id=1 AND syear={$syear}", 'relationship update');
    } else {
        class365_must_query($conn, "INSERT INTO staff_school_relationship (staff_id, school_id, syear, start_date, end_date)
            VALUES (1, 1, {$syear}, '{$syear}-01-01', NULL)", 'relationship insert');
    }
    if ($relExists) {
        $relExists->free();
    }

    class365_must_query($conn, "INSERT IGNORE INTO login_message (id, message, display) VALUES (1, '{$msg}', 'Y')", 'login_message');

    class365_must_query($conn, "INSERT IGNORE INTO program_config (syear, school_id, program, title, value) VALUES
        ({$syear}, NULL, 'Currency', 'Vanuatu Vatu (VUV)', '1'),
        ({$syear}, 1, 'UPDATENOTIFY', 'display', 'Y'),
        ({$syear}, 1, 'UPDATENOTIFY', 'display_school', 'Y')", 'program_config');

    class365_must_query($conn, "INSERT IGNORE INTO program_user_config (user_id, school_id, program, title, value) VALUES
        (1, NULL, 'Preferences', 'THEME', 'blue'),
        (1, NULL, 'Preferences', 'CURRENCY', '1'),
        (1, NULL, 'Preferences', 'HIDDEN', 'Y')", 'program_user_config');

    class365_must_query($conn, "INSERT IGNORE INTO system_preference_misc (fail_count, activity_days, system_maintenance_switch)
        VALUES (5, 30, 'N')", 'system_preference_misc');
    class365_must_query($conn, "UPDATE system_preference_misc SET system_maintenance_switch='N'", 'clear maintenance');

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
        $titleEsc = $conn->real_escape_string($title);
        $conn->query("INSERT IGNORE INTO school_gradelevels (id, school_id, short_name, title, next_grade_id, sort_order)
            VALUES ({$id}, 1, '{$short}', '{$titleEsc}', {$nextSql}, {$sort})");
    }

    $conn->query("INSERT IGNORE INTO school_calendars (school_id, title, syear, calendar_id, default_calendar, days)
        VALUES (1, 'Main Calendar {$syear}', {$syear}, 1, 'Y', 'MTWHF')");

    echo "[class365] Admin seed ready: {$adminUser} / {$adminPass}" . PHP_EOL;
}

echo "[class365] Connecting to {$host}:{$port}/{$db}" . PHP_EOL;
$conn = connect($host, $user, $pass, $db, $port);

$installed = false;
$check = $conn->query("SHOW TABLES LIKE 'login_authentication'");
if ($check && $check->num_rows > 0) {
    $rows = $conn->query("SELECT 1 FROM login_authentication LIMIT 1");
    $installed = $rows && $rows->num_rows > 0;
    if ($rows) {
        $rows->free();
    }
}
if ($check) {
    $check->free();
}

if ($installed) {
    echo "[class365] Schema already present — repairing admin seed." . PHP_EOL;
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
    echo "[class365] Fresh Class 365 schema installed." . PHP_EOL;
}

class365_ensure_admin_seed(
    $conn,
    $schoolName,
    $schoolCity,
    $schoolState,
    $adminUser,
    $adminPass,
    $adminFirst,
    $adminLast,
    $adminEmail,
    $syear
);

$conn->close();
echo "[class365] Bootstrap finished." . PHP_EOL;
