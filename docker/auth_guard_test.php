<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/functions/Class365AuthFnc.php';

$failures = 0;
function expect($cond, string $msg): void
{
    global $failures;
    if (!$cond) {
        fwrite(STDERR, "FAIL: $msg\n");
        $failures++;
    }
}

expect(class365_login_row_usable(['STAFF_ID' => 1], 'STAFF_ID'), 'staff id 1 is usable');
expect(class365_login_row_usable(['STAFF_ID' => '0'], 'STAFF_ID'), 'staff id 0 string is usable');
expect(class365_login_row_usable(['STAFF_ID' => 0], 'STAFF_ID'), 'staff id 0 int is usable');
expect(!class365_login_row_usable(['STAFF_ID' => null], 'STAFF_ID'), 'null staff id is not usable');
expect(!class365_login_row_usable(['STAFF_ID' => ''], 'STAFF_ID'), 'empty staff id is not usable');
expect(!class365_login_row_usable([], 'STAFF_ID'), 'missing staff id is not usable');
expect(!class365_login_row_usable(null, 'STAFF_ID'), 'null row is not usable');

$_SESSION = [];
expect(!class365_has_session_user(), 'empty session has no user');
$_SESSION['STAFF_ID'] = null;
expect(!class365_has_session_user(), 'null STAFF_ID is not a session user');
$_SESSION['STAFF_ID'] = '';
expect(!class365_has_session_user(), 'empty STAFF_ID is not a session user');
$_SESSION['STAFF_ID'] = 1;
expect(class365_has_session_user(), 'STAFF_ID 1 is a session user');
$_SESSION = ['STUDENT_ID' => 9];
expect(class365_has_session_user(), 'STUDENT_ID is a session user');

require_once dirname(__DIR__) . '/functions/ParamLibFnc.php';

$_SERVER = [
    'SERVER_NAME' => 'class365.smartech.pn.vu',
    'SERVER_PORT' => '80',
    'REQUEST_URI' => '/Modules.php?modname=schoolsetup/Periods.php',
];
unset($_SERVER['HTTPS']);
$url = curPageURL();
expect(!str_contains($url, 'Warning'), 'curPageURL does not warn');
expect(str_starts_with($url, 'http://class365.smartech.pn.vu/Modules.php'), 'curPageURL builds http URL without HTTPS key: ' . $url);

$_SERVER['HTTP_X_FORWARDED_PROTO'] = 'https';
$_SERVER['HTTP_X_FORWARDED_HOST'] = 'class365.smartech.pn.vu';
$url = curPageURL();
expect(str_starts_with($url, 'https://class365.smartech.pn.vu/Modules.php'), 'curPageURL honors X-Forwarded-Proto: ' . $url);

if ($failures > 0) {
    fwrite(STDERR, "auth_guard_test failed: {$failures}\n");
    exit(1);
}
echo "OK auth_guard_test\n";
