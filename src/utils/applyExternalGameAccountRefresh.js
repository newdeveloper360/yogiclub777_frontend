import { setAppData, setAuthDataUsersSingleValue } from "../store/features/appData/appDataSlice";

function applyExternalGameAccountRefresh(dispatch, result) {
	const appData = result?.appOutcome?.status === "fulfilled" ? result.appOutcome.value?.data : null;
	const appApplied = Boolean(appData && !appData.error && appData.response);

	if (appApplied) {
		dispatch(setAppData(appData.response));
	}

	const balanceData = result?.balanceOutcome?.status === "fulfilled" ? result.balanceOutcome.value?.data : null;
	const latestBalance =
		balanceData?.response?.balance_left ??
		balanceData?.response?.balance ??
		balanceData?.balance_left ??
		balanceData?.balance;
	const canPatchBalance = !appApplied || Boolean(appData.response?.user);

	if (canPatchBalance && balanceData && !balanceData.error && latestBalance !== undefined) {
		dispatch(
			setAuthDataUsersSingleValue({
				key: "balance",
				value: latestBalance,
			})
		);
	}

	return appApplied || (balanceData && !balanceData.error && latestBalance !== undefined);
}

export { applyExternalGameAccountRefresh };
