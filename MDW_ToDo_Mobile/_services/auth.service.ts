/* eslint-disable prettier/prettier */
import { guestHeader, ApiConfigs } from "../_helpers";

export const AuthService = {
  regiterUser,
  login,
  SendOtpResetPasswordCode,
  CheckOtp,
  ResetPassword
};

async function regiterUser(userData) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...guestHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  try {
    const response = await fetch(
      `${ApiConfigs.base_url}${ApiConfigs.apis.auth.user.register}`,
      requestOptions
    );
    console.log("response-------------------------", response);
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    // Handle error appropriately
    console.error("Registration error:", error);
    throw error;
  }
}

async function login(userData) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...guestHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  try {
    const response = await fetch(
      `${ApiConfigs.base_url}${ApiConfigs.apis.auth.login}`,
      requestOptions
    );
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    // Handle error appropriately
    console.error("Login error:", error);
    throw error;
  }
}

async function SendOtpResetPasswordCode(email) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...guestHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  };

  try {
    const response = await fetch(
      `${ApiConfigs.base_url}${ApiConfigs.apis.user.SendMailResetPassword}`,
      requestOptions
    );
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    // Handle error appropriately
    console.error("SendOtpResetPasswordCode error:", error);
    throw error;
  }
}

async function CheckOtp(code) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...guestHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(code),
  };

  try {
    const response = await fetch(
      `${ApiConfigs.base_url}${ApiConfigs.apis.user.checkCode}`,
      requestOptions
    );
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    // Handle error appropriately
    console.error("CheckOtp error:", error);
    throw error;
  }
}

async function ResetPassword(data) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...guestHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(
      `${ApiConfigs.base_url}${ApiConfigs.apis.user.ResetPassword}`,
      requestOptions
    );
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    // Handle error appropriately
    console.error("ResetPassword error:", error);
    throw error;
  }
}





async function handleResponse(response) {
  try {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if (response.status === 401) {
        // Redirect or handle unauthorized access
        // Example: navigation.navigate('Login');
        console.log("Unauthorized access, redirecting...");
      }

      const error = (data && data.message) || response.statusText;
      throw error;
    }

    return data;
  } catch (error) {
    // Handle JSON parsing errors or other unexpected issues
    console.error("Response handling error:", error);
    throw error;
  }
}
