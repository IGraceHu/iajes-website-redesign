import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { supabase } from "./supabase-client.mjs";

// Generate a unique email to avoid collisions between test runs
const timestamp = Date.now();
const TEST_EMAIL = `test-${timestamp}@test.com`;
const TEST_FNAME = "Jane";
const TEST_LNAME = "Doe";
const TEST_PASSWORD = "TestPass123!";

let testUserId = null;

describe("Signup to Profile integration", () => {
  it("should create an account and store fname, lname, email in users table", async () => {
    // Step 1: Sign up via Supabase Auth (mirrors signup.jsx logic)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      options: {
        data: {
          fname: TEST_FNAME,
          lname: TEST_LNAME,
        },
      },
    });

    assert.equal(authError, null, `Auth signup failed: ${authError?.message}`);
    assert.ok(authData.user, "Auth signup did not return a user");
    assert.ok(authData.user.id, "Auth user has no id");

    testUserId = authData.user.id;

    // Step 2: Insert into custom users table (mirrors signup.jsx logic)
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        fname: TEST_FNAME,
        lname: TEST_LNAME,
        email: TEST_EMAIL,
        created_at: authData.user.created_at,
        last_sign_in:
          authData.user.last_sign_in_at || new Date().toISOString(),
      },
    ]);

    assert.equal(
      dbError,
      null,
      `Users table insert failed: ${dbError?.message}`
    );

    // Step 3: Query the users table to simulate what the profile page does
    const { data: profileRow, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", testUserId)
      .single();

    assert.equal(
      fetchError,
      null,
      `Profile fetch failed: ${fetchError?.message}`
    );
    assert.ok(profileRow, "No profile row returned");

    // Step 4: Assert signup data matches profile data
    assert.equal(profileRow.fname, TEST_FNAME, "First name mismatch");
    assert.equal(profileRow.lname, TEST_LNAME, "Last name mismatch");
    assert.equal(profileRow.email, TEST_EMAIL, "Email mismatch");
    assert.equal(profileRow.id, testUserId, "User ID mismatch");
    assert.ok(profileRow.created_at, "created_at is missing");
    assert.ok(profileRow.last_sign_in, "last_sign_in is missing");
  });

  after(async () => {
    // Cleanup: delete test row from users table
    if (testUserId) {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", testUserId);

      if (error) {
        console.warn(`Cleanup warning: could not delete test user row: ${error.message}`);
      }
    }
  });
});
