import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { loadAccountAfterExternalGame } from "../repository/ExternalGameRepository";
import { applyExternalGameAccountRefresh } from "../utils/applyExternalGameAccountRefresh";

const ExternalGameReturn = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [message, setMessage] = useState("Updating your points…");

	useEffect(() => {
		document.title = "Aviator | Yogi Club777";
	}, []);

	useEffect(() => {
		if (window.top !== window.self) {
			try {
				window.top.location.replace(window.location.href);
			} catch (err) {
				setMessage("Return to Yogi Club777 from the game menu.");
			}
			return;
		}

		let active = true;

		const finish = async () => {
			if (!localStorage.getItem("authToken")) {
				navigate("/auth/login", { replace: true });
				return;
			}

			try {
				const result = await loadAccountAfterExternalGame();
				if (!active) {
					return;
				}

				if (result.authFailed) {
					localStorage.clear();
					toast.error("Your session has expired. Please sign in again.");
					navigate("/auth/login", { replace: true });
					return;
				}

				const updated = applyExternalGameAccountRefresh(dispatch, result);
				if (!updated) {
					toast.error("Points could not be refreshed. They will update from the server shortly.");
				}
			} catch (err) {
				if (active) {
					toast.error("Points could not be refreshed. They will update from the server shortly.");
				}
			} finally {
				if (active) {
					navigate("/", { replace: true });
				}
			}
		};

		finish();

		return () => {
			active = false;
		};
	}, [dispatch, navigate]);

	return (
		<div className="external-game-page font-poppins">
			<div className="external-game-status">
				<Spinner size={36} />
				<p>{message}</p>
			</div>
		</div>
	);
};

export default ExternalGameReturn;
