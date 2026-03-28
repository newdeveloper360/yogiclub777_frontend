import Repository from "./Repository";

function getMarkets() {
  return Repository.post(`/get-markets?type=desawar`);
}

export { getMarkets };
