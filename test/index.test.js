const axios = require("axios");

function sum(a, b) {
  return a + b;
}

const BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {

  test("User is able to signup only once", async () => {
    const username = "sohel" + Math.random();
    const password = "123456";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(200);
    const updateResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(updateResponse.statusCode).toBe(400);
  });
  test("Signup request fails if the username is empty", async () => {
    const password = "123456";

    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      type: "admin",
    });
    expected(response.statusCode).toBe(400);
  });
  test("Signin succeed if the username and password are correct", async () => {
    const username = `sohel-${Math.random()}`;
    const password = "132456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expected(response.statusCode).toBe(200);
    expected(response.body.token).toBeDefined();
  });
  test("Signin fail if the username and password are incorrect", async () => {
    const username = `sohel-${Math.random()}`;
    const password = "132456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: 'alsdfkj',
      password,
    });
    expected(response.statusCode).toBe(403);
    expected(response.body.token).toBeUndefined();
  });

});
