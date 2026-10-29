import Repository from "./Repository";
import { getAppData } from "./DataRepository";
import { getUserBalance } from "./BalanceRepository";
import { getGameHistory } from "./HistoryRepository";

const ASSIGNED_EXTERNAL_GAMES = ["aviator"];
const AVIATOR_ORIGIN = "https://aviator.desiapi.com";

let aviatorLaunchTask = null;

function authHeaders() {
	const token = localStorage.getItem("authToken");
	if (!token) {
		const error = new Error("Please sign in to play Aviator.");
		error.code = "UNAUTHENTICATED";
		throw error;
	}
	return { Authorization: `Bearer ${token}` };
}

function launchExternalGame(game) {
	if (!ASSIGNED_EXTERNAL_GAMES.includes(game)) {
		const error = new Error("This game is not available.");
		error.code = "UNAVAILABLE";
		return Promise.reject(error);
	}

	if (game === "aviator" && aviatorLaunchTask) {
		return aviatorLaunchTask;
	}

	const request = Repository.post(`/external-games/${game}/launch`, undefined, {
		headers: authHeaders(),
	});

	if (game === "aviator") {
		aviatorLaunchTask = request.finally(() => {
			aviatorLaunchTask = null;
		});
		return aviatorLaunchTask;
	}

	return request;
}

function readPlayableUrl(redirectUrl) {
	if (typeof redirectUrl !== "string" || redirectUrl.trim() === "") {
		return "";
	}

	let parsed;
	try {
		parsed = new URL(redirectUrl);
	} catch (err) {
		return "";
	}

	if (parsed.origin !== AVIATOR_ORIGIN || parsed.protocol !== "https:") {
		return "";
	}

	return redirectUrl;
}

function loadAccountAfterExternalGame() {
	return Promise.allSettled([
		getAppData(),
		getUserBalance(),
		getGameHistory({ page: 1, date: "", marketId: "" }),
	]).then(([appOutcome, balanceOutcome, historyOutcome]) => {
		const authFailed = [appOutcome, balanceOutcome, historyOutcome].some((outcome) => {
			const status = outcome.reason?.response?.status;
			return outcome.status === "rejected" && (status === 401 || status === 419);
		});

		return { appOutcome, balanceOutcome, historyOutcome, authFailed };
	});
}

export {
	ASSIGNED_EXTERNAL_GAMES,
	AVIATOR_ORIGIN,
	launchExternalGame,
	readPlayableUrl,
	loadAccountAfterExternalGame,
};
