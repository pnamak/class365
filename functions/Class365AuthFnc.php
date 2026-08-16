<?php
/**
 * Class 365 login helpers — keep admin sign-in from succeeding into an empty session.
 */

function class365_has_usable_id($value): bool
{
    return $value !== null && $value !== '' && $value !== false;
}

function class365_login_row_usable(?array $row, string $idKey = 'STAFF_ID'): bool
{
    return is_array($row) && class365_has_usable_id($row[$idKey] ?? null);
}

function class365_has_session_user(): bool
{
    return class365_has_usable_id($_SESSION['STAFF_ID'] ?? null)
        || class365_has_usable_id($_SESSION['STUDENT_ID'] ?? null);
}

function class365_normalize_modname($modname): string
{
    return trim((string) $modname);
}

function class365_apply_request_modname(): void
{
    foreach (['modname'] as $key) {
        if (isset($_REQUEST[$key]) && is_string($_REQUEST[$key])) {
            $_REQUEST[$key] = class365_normalize_modname($_REQUEST[$key]);
        }
        if (isset($_GET[$key]) && is_string($_GET[$key])) {
            $_GET[$key] = class365_normalize_modname($_GET[$key]);
        }
        if (isset($_POST[$key]) && is_string($_POST[$key])) {
            $_POST[$key] = class365_normalize_modname($_POST[$key]);
        }
    }
}

function class365_is_super_admin(): bool
{
    $ids = [];
    if (isset($_SESSION['PROFILE_ID'])) {
        $ids[] = $_SESSION['PROFILE_ID'];
    }
    if (class365_has_session_user() && function_exists('User')) {
        $ids[] = User('PROFILE_ID');
    }
    foreach ($ids as $id) {
        if ($id === 0 || $id === '0') {
            return true;
        }
    }
    return false;
}
