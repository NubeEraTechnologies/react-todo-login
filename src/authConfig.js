export const msalConfig = {
  auth: {
    clientId: "25856780-4f46-4435-af51-f80b53b6c96a",
    authority:
      "https://login.microsoftonline.com/730278f4-a633-4b89-b030-557f72635af5",
    redirectUri: "http://localhost:3000",
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // you can add custom API scopes here
};
