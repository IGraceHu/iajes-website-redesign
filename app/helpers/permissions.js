import { supabase } from "../supabase";

/* checkCurrentAuth
 * Checks current user for admin permissions
 * Parameters:
 *     setIsAdmin - A useState setter that reflects if current user is admin or not
 *     targetRoles - an array the roles that are allowed (aside from admin-super)
 *     superAllowed = true - Optional. Determines if admin-super gets permissions
 * Returns authentication subscription thing
 */
export function checkCurrentAuth(setIsAdmin, targetRoles, superAllowed = true) {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user.id) {
            currentHasPermissions(session?.user.id, targetRoles, superAllowed).then(
                function (hasPermissions) { setIsAdmin(hasPermissions); }
            );
        }
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user.id) {
            currentHasPermissions(session?.user.id, targetRoles, superAllowed).then(
                function (hasPermissions) { setIsAdmin(hasPermissions); }
            );
        }
    });


    return () => subscription.unsubscribe();
}


/* currentHasPermissions
 * Fetches and checks the given user's role for the correct permissions
 * Parameters:
 *     userID - the user's ID
 *     targetRoles - an array the roles that are allowed (aside from admin-super)
 *     superAllowed = true - Optional. Determines if admin-super gets permissions
 * Returns true if the user has one of the target roles, false if not or if the user is not found
 */
export async function currentHasPermissions(userId, targetRoles, superAllowed = true) {
    const userRoles = await getUserRoles(userId);
    if (!Array.isArray(targetRoles)) { targetRoles = [targetRoles] }
    if (userRoles) {
        return hasPermissions(userRoles, targetRoles, superAllowed);
    }
    return false;
}

/* getUserRoles
 * Gets user roles from a given userID from database
 * Parameters:
 *     userId - user's ID
 * Returns an array of the given user's roles. False if not found.
 */
export async function getUserRoles(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('roles')
            .eq("id", userId);
        if (data[0]) {
            return data[0].roles;
        }
        return false;

    } catch (error) {
        console.log(error);
        return false;
    }
}


/* hasPermissions
 * Check the given user's role for the correct permissions
 * Parameters:
 *     userRoles - an array of the user's roles, each a string
 *     targetRoles - an array the roles that are allowed (aside from admin-super)
 *     superAllowed = true - Optional. Determines if admin-super gets permissions
 * Returns true if the user has one of the target roles, false if not
 */
function hasPermissions(userRoles, targetRoles, superAllowed = true) {
    if (userRoles.length > 0 && targetRoles.length > 0) {
        if (superAllowed && userRoles.includes("admin-super")) {
            return true;
        } else {
            for (let targetRole of targetRoles) {
                if (userRoles.includes(targetRole)) {
                    return true;
                }
            }
        }
    }
    return false;
}


