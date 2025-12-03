import axios from "axios";
import Utils from "../config/utils.js";
import AuthServices from "./authServices.js";
import Router from "../router.js";

// Prefer an explicit Vite env var `VITE_API_BASE_URL` (or the older
// `VITE_APP_BASE_API_URL`) for production configuration. If not set,
// fall back to the previous behavior (dev -> localhost proxy, prod -> /tracker-t8/).
const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_APP_BASE_API_URL;
var baseurl = "";
if (envBase) {
  baseurl = envBase.endsWith("/") ? envBase : envBase + "/";
} else if (import.meta.env.DEV) {
  baseurl = "http://localhost:3128/tracker-t8/";
} else {
  baseurl = "/tracker-t8/";
}

const apiClient = axios.create({
  baseURL: baseurl,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  transformRequest: (data, headers) => {
    let user = Utils.getStore("user");
    if (user != null) {
      let token = user.token;
      let authHeader = "";
      if (token != null && token != "") authHeader = "Bearer " + token;
      headers["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    data = JSON.parse(data);
    // if (!data.success && data.code == "expired-session") {
    //   localStorage.deleteItem("user");
    // }
    if (data.message !== undefined && data.message.includes("Unauthorized")) {
      AuthServices.logoutUser(Utils.getStore("user"))
        .then((response) => {
          console.log(response);
          Utils.removeItem("user");
          localStorage.clear();
          Router.push({ name: "login" });
        })
        .catch((error) => {
          console.log("error", error);
        });
      // Utils.removeItem("user")
    }
    // console.log(Utils.getStore("user"))
    return data;
  },
});

export default apiClient;
