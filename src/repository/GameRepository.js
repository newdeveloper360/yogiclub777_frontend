import Repository from "./Repository";

function submitGame(payload) {
  return Repository.post(`/submit-game`, payload);
}

function deleteSinglePlay(payload) {
  return Repository.post(
    `/delete-single-play?type=desawar&game_id=${payload.gameId}`
  );
}

function getGameDetails(payload){
  return Repository.post(
    `/get-game-details?type=desawar&market_id=${payload.marketId}`
  );
}

export { submitGame, deleteSinglePlay, getGameDetails };
