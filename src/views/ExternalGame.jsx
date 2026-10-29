import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
	launchExternalGame,
	loadAccountAfterExternalGame,
	readPlayableUrl,
} from "../repository/ExternalGameRepository";
import { applyExternalGameAccountRefresh } from "../utils/applyExternalGameAccountRefresh";

const RETURN_PATH = "/external-games/return";

function failureFromError(err) {
	const status = err?.response?.status;
	const serverMessage = err?.response?.data?.message;

	if (err?.code === "UNAUTHENTICATED") {
		return {
			code: "auth",
			message: err.message,
		};
	}

	if (status === 401 || status === 419) {
		return {
			code: "auth",
			message: "Your session has expired. Please sign in again.",
		};
	}

	if (err?.code === "UNAVAILABLE" || status === 403 || status === 404) {
		return {
			code: "unavailable",
			message: serverMessage || "Aviator is not available right now.",
		};
	}

	if (status === 429) {
		return {
			code: "retry",
			message: "Please wait a moment before opening Aviator again.",
		};
	}

	if (!err?.response) {
		return {
			code: "retry",
			message: "Network error. Check your connection and try again.",
		};
	}

	return {
		code: "retry",
		message: serverMessage || "Could not open Aviator. Please try again.",
	};
}

const ExternalGame = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const frameRef = useRef(null);
	const openedRef = useRef(false);
	const [attempt, setAttempt] = useState(0);
	const [status, setStatus] = useState("loading");
	const [message, setMessage] = useState("");
	const [playUrl, setPlayUrl] = useState("");

	useEffect(() => {
		document.title = "Aviator | Yogi Club777";
	}, []);

	useEffect(() => {
		let cancelled = false;

		const openGame = async () => {
			setStatus("loading");
			setMessage("");
			setPlayUrl("");

			try {
				const { data } = await launchExternalGame("aviator");
				if (cancelled) {
					return;
				}

				if (data?.error) {
					setStatus("error");
					setMessage(data.message || "Could not open Aviator. Please try again.");
					return;
				}

				const nextUrl = readPlayableUrl(data?.redirect_url || data?.response?.redirect_url);
				if (!nextUrl) {
					setStatus("error");
					setMessage("Aviator did not return a playable link. Please try again.");
					return;
				}

				openedRef.current = true;
				setPlayUrl(nextUrl);
				setStatus("ready");
			} catch (err) {
				if (cancelled) {
					return;
				}

				const failure = failureFromError(err);
				if (failure.code === "auth") {
					if (err?.code !== "UNAUTHENTICATED") {
						localStorage.clear();
					}
					toast.error(failure.message);
					navigate("/auth/login", { replace: true });
					return;
				}

				setStatus("error");
				setMessage(failure.message);
			}
		};

		openGame();

		return () => {
			cancelled = true;
			if (frameRef.current) {
				frameRef.current.src = "about:blank";
			}
		};
	}, [attempt, navigate]);

	useEffect(() => {
		return () => {
			if (!openedRef.current) {
				return;
			}
			openedRef.current = false;
			loadAccountAfterExternalGame()
				.then((result) => {
					if (result.authFailed) {
						localStorage.clear();
						window.location.replace("/auth/login");
						return;
					}
					applyExternalGameAccountRefresh(dispatch, result);
				})
				.catch(() => {});
		};
	}, [dispatch]);

	const leaveGame = () => {
		if (frameRef.current) {
			frameRef.current.src = "about:blank";
		}
		setPlayUrl("");
		navigate(RETURN_PATH, { replace: true });
	};

	const goBack = () => {
		if (status === "ready") {
			leaveGame();
			return;
		}
		navigate("/", { replace: true });
	};

	const handleFrameLoad = () => {
		const frame = frameRef.current;
		if (!frame) {
			return;
		}

		let path = "";
		try {
			path = frame.contentWindow.location.pathname;
		} catch (err) {
			return;
		}

		if (path === RETURN_PATH) {
			leaveGame();
		}
	};

	return (
		<div className="external-game-page font-poppins">
			<div className="external-game-bar bg-primary">
				<button type="button" className="external-game-back" onClick={goBack}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="external-game-back-icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
						/>
					</svg>
					Back
				</button>
				<span className="external-game-title">Aviator</span>
			</div>

			{status === "ready" && playUrl ? (
				<iframe
					ref={frameRef}
					className="external-game-frame"
					src={playUrl}
					title="Aviator"
					allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
					allowFullScreen
					referrerPolicy="strict-origin-when-cross-origin"
					onLoad={handleFrameLoad}
				/>
			) : (
				<div className="external-game-status">
					{status === "loading" ? (
						<>
							<Spinner size={36} />
							<p>Opening Aviator…</p>
						</>
					) : (
						<>
							<p>{message}</p>
							<button
								type="button"
								className="external-game-retry"
								onClick={() => setAttempt((current) => current + 1)}
							>
								Try again
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default ExternalGame;
