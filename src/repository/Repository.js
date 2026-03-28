import axios from "axios";
export const BASE_URL = "https://api.yogiclub777.com/api";  // Live
export const ONESIGNAL_APP_ID = '9b3647cd-a369-468d-b4b9-0734a6424ca1';
// export const BASE_URL = "http://127.0.0.1:8002/api";   // Demo

const getAuthorizationToken = () => {
	let authToken = localStorage.getItem("authToken");
	if (authToken) {
		return `Bearer ${authToken}`;
	}
	return '';
}

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		Accept: 'application/json',
		Authorization: getAuthorizationToken(),
		request_type: 'web_app',
	},
});

export default apiClient;