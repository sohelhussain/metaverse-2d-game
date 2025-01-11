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

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
      const username = `kirat-${Math.random()}`
      const password = "123456"

      const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
       username,
       password,
       type: "admin"
      });

      adminId = signupResponse.data.userId

      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
       username,
       password
      })

      adminToken = response.data.token

      const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username: username + "-user",
          password,
          type: "user"
      });
 
      userId = userSignupResponse.data.userId
  
      const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
          username: username + "-user",
          password
      })
  
      userToken = userSigninResponse.data.token

      const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          "width": 1,
          "height": 1,
        "static": true
      }, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      });

      const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
          "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
          "width": 1,
          "height": 1,
        "static": true
      }, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      })
      element1Id = element1Response.data.id
      element2Id = element2Response.data.id
      console.log(element2Id)
      console.log(element1Id)
      const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
          "thumbnail": "https://thumbnail.com/a.png",
          "dimensions": "100x200",
          "name": "Test space",
          "defaultElements": [{
                  elementId: element1Id,
                  x: 20,
                  y: 20
              }, {
                elementId: element1Id,
                  x: 18,
                  y: 20
              }, {
                elementId: element2Id,
                  x: 19,
                  y: 20
              }
          ]
       }, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
       })
       console.log("mapResponse.status")
       console.log(mapResponse.data.id)

       mapId = mapResponse.data.id

  });

  test("User is able to create a space", async () => {

      const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
        "name": "Test",
        "dimensions": "100x200",
        "mapId": mapId
     }, {
      headers: {
          authorization: `Bearer ${userToken}`
      }
     })
     expect(response.status).toBe(200)
     expect(response.data.spaceId).toBeDefined()
  })

  test("User is able to create a space without mapId (empty space)", async () => {
      const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
        "name": "Test",
        "dimensions": "100x200",
     }, {
      headers: {
          authorization: `Bearer ${userToken}`
      }
     })

     expect(response.data.spaceId).toBeDefined()
  })

  test("User is not able to create a space without mapId and dimensions", async () => {
      const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
        "name": "Test",
     }, {
      headers: {
          authorization: `Bearer ${userToken}`
      }
     })

     expect(response.status).toBe(400)
  })

  test("User is not able to delete a space that doesnt exist", async () => {
      const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
          headers: {
              authorization: `Bearer ${userToken}`
          }
      })

     expect(response.status).toBe(400)
  })

  test("User is able to delete a space that does exist", async () => {
      const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
          "name": "Test",
          "dimensions": "100x200",
      }, {
          headers: {
              authorization: `Bearer ${userToken}`
          }
      })

      const deleteReponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
          headers: {
              authorization: `Bearer ${userToken}`
          }
      })

     expect(deleteReponse.status).toBe(200)
  })

  test("User should not be able to delete a space created by another user", async () => {
      const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
          "name": "Test",
          "dimensions": "100x200",
      }, {
          headers: {
              authorization: `Bearer ${userToken}`
          }
      })

      const deleteReponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      })

     expect(deleteReponse.status).toBe(403)
  })

  test("Admin has no spaces initially", async () => {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      });
      expect(response.data.spaces.length).toBe(0)
  })

  test("Admin has gets once space after", async () => {
      const spaceCreateReponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
          "name": "Test",
          "dimensions": "100x200",
      }, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      });
      console.log('jhflksdjflksdfjlksdfj')
      console.log(spaceCreateReponse.data)
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
          headers: {
              authorization: `Bearer ${adminToken}`
          }
      });
      const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateReponse.data.spaceId)
      expect(response.data.spaces.length).toBe(1)
      expect(filteredSpace).toBeDefined()

  })
})