const axios = require("axios");

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
     type: "admin",
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
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: 'alsdfkj',
      password,
    });
    expected(response.statusCode).toBe(403);
    expected(response.body.token).toBeUndefined();
  });

});

describe("User Information endPoints", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `sohel-${Math.random()}`;
    const password = "132456";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
    avatarId = response.data.user.avatarId;


    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://image.com/avatar1.png",
     "name": "Timmy"
    })
  });

  test('User cant update there metadata with wrong avatar id', async () => { 
    const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId: '3124', 
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    expect(response.statusCode).toBe(400);
   })

   test('User can update their metadata', async () => { 
    const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId 
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    expect(response.statusCode).toBe(200);
   })
   test('User is not able to update their metadata if the auth is header is not present', async () => { 
    const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId 
    });
    expect(response.statusCode).toBe(403);
   })
});

describe("User Avatar information endPoints", () => {
  let token;
  let avatarId;
  let userId;

  beforeAll(async () => {
    const username = `sohel-${Math.random()}`;
    const password = "132456";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    userId = signupResponse.data.id;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;
    avatarId = response.data.user.avatarId;


    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://image.com/avatar1.png",
     "name": "Timmy"
    })
  });

});
