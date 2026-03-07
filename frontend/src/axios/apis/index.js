import api from "../api";
import { showTokenExpiredToast } from "../../showTokenExpired/ShowTokenExpiredToken";

// let tokenExpiredShown = false;

export async function getCall(endPoint) {
  try {
    const response = await api.get(endPoint);
    return response;
  } catch (error) {
    // if (error?.response?.status === 401) {
    //   if (!tokenExpiredShown) {
    //     tokenExpiredShown = true;
    //     showTokenExpiredToast({
    //       message: error?.response?.data?.message || "Session Expired",
    //     });
    //   }
    //   return;
    // }
    throw error;
  }
}

export async function postCall(endPoint, body) {
  const response = await api.post(endPoint, body);
  return response;
}

export async function patchCall(endpoint, params = {}, body = {}) {
  const response = await api.patch(endpoint, body, {
    params: params,
  });
  return response;
}

export default { getCall, postCall, patchCall };
