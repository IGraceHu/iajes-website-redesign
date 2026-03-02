const signIn = require('../routes/auth/signin');
const signUp = require('../routes/auth/signup');

test('Sign In with existing user', async () => {
    const testSignIn = {
        email: "ihu@scu.edu",
        pwd: "testdev"
    }
  const result = await signIn(testSignIn);
  expect(result).toBe(true);
});

test('Sign In with unknown email', async () => {
    const testSignIn = {
        email: "unknown@test.com",
        pwd: "testdev"
    }
  const result = await signIn(testSignIn);
  expect(result).toBe("invalid");
});

test('Sign In with wrong password', async () => {
    const testSignIn = {
        email: "ihu@scu.edu",
        pwd: "wrongPwd"
    }
  const result = await signIn(testSignIn);
  expect(result).toBe("invalid");
});

test('Sign Up as existing user', async () => {
    const testSignUp = {
        email: "ihu@scu.edu",
        pwd: "testdev"
    }
  const result = await signUp(testSignUp);
  expect(result.success).toBe(false);
  expect(result.message).toBe("An account with this email already exists. Please sign in instead.");
});

test('Sign Up as new user', async () => {
    const testSignUp = {
        email: "test@email.com",
        pwd: "testdev"
    }
  const result = await signUp(testSignUp);
  expect(result).toBe(true);
});