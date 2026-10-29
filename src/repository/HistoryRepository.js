import Repository from "./Repository";

function getDepositHistory(payload) {
  return Repository.post(`/get-deposit-history?page=${payload.page}`);
}

function getWithdrawalHistory(payload) {
  return Repository.post(`/get-withdrawl-history?page=${payload.page}`);
}

function getGameHistory(payload) {
	return Repository.post(
		`/get-game-history?type=desawar&page=${payload.page}&date=${payload.date}&market_id=${payload.marketId}`
	);
}

function deleteUserDataHistory() {
	return Repository.get(`/delete-user-data-history`)
}

function getAviatorHistory({ page = 1, status, date }) {
	const token = localStorage.getItem("authToken");
	const params = { page };
	if (status) {
		params.status = status;
	}
	if (date) {
		params.date = date;
	}

	return Repository.get("/external-games/aviator/history", {
		params,
		headers: {
			Accept: "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
}

export { getDepositHistory, getWithdrawalHistory, getGameHistory, deleteUserDataHistory, getAviatorHistory };
