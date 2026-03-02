const signIn = require('../routes/auth/signin');

test('Sign In with user', async () => {
    const testSignIn = {
        email: "ihu@scu.edu",
        pwd: "testdev"
    }
  const result = await signIn(testSignIn);
  expect(result).toBe(true);
});