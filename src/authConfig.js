export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority:
      "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:3000",
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // you can add custom API scopes here
};
