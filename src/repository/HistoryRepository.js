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

export { getDepositHistory, getWithdrawalHistory, getGameHistory, deleteUserDataHistory };
