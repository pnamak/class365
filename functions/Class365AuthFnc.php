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
