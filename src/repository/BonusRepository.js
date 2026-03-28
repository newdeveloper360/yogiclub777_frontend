import Repository from "./Repository";

function getBonusReport(payload) {
  return Repository.get(
    `/get-referral-details?page=${payload.page}`
  );
}

export { getBonusReport };
