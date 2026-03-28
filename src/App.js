import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './assets/css/Global.css';
import Home from './views/Home';
import Main from './layouts/Main';
import EditProfile from './views/EditProfile';
import AppDetails from './views/AppDetails';
import History from './views/History';
import BonusReport from './views/BonusReport';
import ResultHistory from './views/ResultHistory';
import TermsAndConditions from './views/TermsAndConditions';
import GamePosting from './views/GamePosting';
import Default from './layouts/Default';
import Wallet from './views/Wallet';
import Help from './views/Help';
import Auth from './layouts/Auth';
import Login from './views/Login';
import Notifications from './views/Notifications';
import Play from './views/Play';
import PlayGame from './views/PlayGame';
import Modal from './components/Modal';
import Logo from './assets/imgs/Logo.png';
import Game from './layouts/Game';
import Chat from './views/Chat';
import { ToastContainer, toast } from 'react-toastify';
import { getAppData } from './repository/DataRepository';
import 'react-toastify/dist/ReactToastify.css';
import { setAppData } from './store/features/appData/appDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import Splash from './views/Splash';
import { getMarkets } from './repository/MarketRepository';
import { setMarkets } from './store/features/markets/marketSlice';
import { ModalContextProvider } from './context/ModalContext';
import { DeferredPromptContextProvider } from './context/DeferredPromptContext';
import NotFound from './views/NotFound';
import CanceledHistory from './views/CanceledHistory';
import { GameHistoryProvider } from './context/GameHistoryContext';
import useOneSignal from './hooks/useOneSignal';
import happyHolidayImg from './assets/imgs/happyHolidays.png'
// import Pusher from 'pusher-js';
// import Swal from 'sweetalert2';
import MarketResult from './views/MarketResult';

export const routes = [
	{
		element: <Main />,
		children: [
			{
				path: '/',
				element: (
					<GameHistoryProvider>
						<Home />
					</GameHistoryProvider>
				),
				name: 'Home',
			},
			{
				path: '/play',
				element: <Play />,
				name: 'Play',
			},
			{
				path: '/profile',
				element: <EditProfile />,
				name: 'Profile',
			},
			{
				path: '/app-details',
				element: <AppDetails />,
				name: 'App Details',
			},
			{
				path: '/history',
				element: <History />,
				name: 'History',
			},
			{
				path: '/canceled-history',
				element: <CanceledHistory />,
				name: 'CanceledHistory',
			},
			{
				path: '/bonus-report',
				element: <BonusReport />,
				name: 'Bonus Report',
			},
			{
				path: '/result-history',
				element: <ResultHistory />,
				name: 'Result History',
			},
			{
				path: '/market-result/:market_id',
				element: <MarketResult />,
				name: 'Market Result',
			},
			{
				path: '/terms-and-condition',
				element: <TermsAndConditions />,
				name: 'Terms And Conditions',
			},
			{
				path: '/wallet',
				element: <Wallet />,
				name: 'Wallet',
			},
			{
				path: '/help',
				element: <Help />,
				name: 'Help',
			},
			{
				path: '/notifications',
				element: <Notifications />,
				name: 'Help',
			},
		],
	},
	{
		element: <Auth />,
		children: [
			{
				path: '/auth/login',
				element: <Login />,
			},
		],
	},
	{
		element: <Default />,
		children: [
			{
				path: '/game-posting',
				element: <GamePosting />,
				name: 'Game Posting',
			},
			{
				path: '/withdrawal-chat',
				element: <Chat />,
				name: 'Withdrawal Chat',
			},
			{
				path: '/deposit-chat',
				element: <Chat />,
				name: 'Deposit Chat',
			},
		],
	},
	{
		element: <Game />,
		children: [
			{
				path: '/play-game',
				element: <PlayGame />,
				name: 'Play Game',
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
];

const App = () => {
	const router = createBrowserRouter(routes);
	const dispatch = useDispatch();
	const [isOpen, setOpen] = useState(false);
	const { appData, user } = useSelector(state => state.appData.appData);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const toggle = () => {
		setOpen(prevState => !prevState);
	};

	let [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
	let [successMessage, setSuccessMessage] = useState('');
	const toggleSuccessModalOpen = () => {
		setSuccessModalOpen(prevState => !prevState);
	};

	const [deferredPrompt, setDeferredPrompt] = useState(null);

	const handleVersionMismatch = async latestVersion => {
		try {
			if ('caches' in window) {
				const names = await window.caches.keys();
				await Promise.all(names.map(name => window.caches.delete(name)));
			}
		} catch (e) {
			console.log(e);
			// Best-effort cache clear; still proceed to reload.
		} finally {
			localStorage.setItem('version', latestVersion);
			window.location.href = window.location.origin + '?v=' + Date.now().toString(10);
		}
		
		// const result = await Swal.fire({
		// 	title: 'New version available',
		// 	text: 'Please update to the latest version',
		// 	icon: 'warning',
		// 	confirmButtonText: 'Update',
		// });

		// if (result.isConfirmed) {
		// 	// cache clear and hard reload code add
		// }
	};

	useEffect(() => {
		const handleBeforeInstallPrompt = e => {
			e.preventDefault();
			setDeferredPrompt(e);
		};

		window.addEventListener(
			'beforeinstallprompt',
			handleBeforeInstallPrompt
		);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
		};
	}, []);

	useEffect(() => {
		document.title = 'Yogi Club777';
		const fetchData = async () => {
			try {
				setLoading(true);
				const fetchAppData = async () => {
					let { data } = await getAppData();
					if (!data.error) {
						dispatch(setAppData(data.response));
						setLoading(false);
					} else {
						setError(data.message);
					}
				};
				const fetchMarkets = async () => {
					if (localStorage.getItem('authToken')) {
						let { data } = await getMarkets();
						if (data.error === false) {
							dispatch(setMarkets(data.response));
						} else {
							toast.error(data.message);
						}
					}
				};
				await fetchAppData();
				await fetchMarkets();
			} catch (err) {
				toast.error(err.message);
			} finally {
				// window.setTimeout(() => {
				// 	setLoading(false);
				// }, 2500);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (user?.blocked === 1) {
			localStorage.clear();
			toast.error(
				"Sorry, you have been blocked. You'll be redirected back to login page."
			);
			window.setTimeout(() => {
				window.location.href = '/auth/login';
			}, 2000);
		}
		if (user) {
			setOpen(
				!JSON.parse(sessionStorage.getItem('isModelOpenedAlready')) ??
					true
			);

			sessionStorage.setItem(
				'isModelOpenedAlready',
				JSON.stringify(true)
			);
		}
	}, [user]);

	// check version
	useEffect(() => {
		if (!appData?.version) return;

		const storedVersion = parseInt(localStorage.getItem('version'), 10);

		if (appData.version !== storedVersion) {
			handleVersionMismatch(appData.version);
		}
	}, [appData]);

	// ==== Enable one signal 
	// useOneSignal(); // OneSignal

	const maintenanceMode = () => {
		return (
			<div className='font-poppins border border-black/20 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100dvh]'>
				<div className='flex flex-col items-center py-8'>
					<img src={Logo} width={100} alt='Logo' />
					<h2 className='mt-8 text-4xl font-extrabold'>
						We're Sorry!
					</h2>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						data-name='Layer 1'
						className='w-full max-w-[420px] mt-6'
						viewBox='0 0 945 583.2243'
						xmlnsXlink='http://www.w3.org/1999/xlink'
					>
						<path
							id='b0cf38c7-358d-48dc-a444-e9782686dfa5-43'
							data-name='Path 438'
							d='M222.88482,693.5243a24.21463,24.21463,0,0,0,23.38269-4.11877c8.18977-6.87442,10.758-18.196,12.84671-28.68191l6.17972-31.01657-12.93769,8.90836c-9.30465,6.40641-18.81827,13.01866-25.26012,22.29785s-9.25222,21.94708-4.07792,31.988'
							transform='translate(-127.5 -158.38785)'
							fill='#e6e6e6'
						/>
						<path
							id='acbbaa8b-0bc2-4bc9-96d7-93dd88f90f19-44'
							data-name='Path 439'
							d='M224.88254,733.23486c-1.6284-11.86369-3.30382-23.88079-2.15885-35.87167,1.01467-10.64933,4.26374-21.04881,10.87831-29.57938a49.20592,49.20592,0,0,1,12.62466-11.44039c1.26216-.79648,2.4241,1.20354,1.16733,1.997A46.77938,46.77938,0,0,0,228.88954,680.666c-4.02858,10.24607-4.67546,21.41582-3.98154,32.30029.41943,6.58218,1.31074,13.12121,2.20587,19.65252a1.19817,1.19817,0,0,1-.808,1.4225,1.16348,1.16348,0,0,1-1.42253-.808Z'
							transform='translate(-127.5 -158.38785)'
							fill='#f2f2f2'
						/>
						<path
							id='bed63620-84ae-4c66-a7c8-0d9b30f8c1e7-45'
							data-name='Path 442'
							d='M236.60356,714.19841A17.82515,17.82515,0,0,0,252.135,722.217c7.8644-.37318,14.41806-5.85972,20.31713-11.07026l17.452-15.40881-11.54988-.5528c-8.30619-.39784-16.82672-.771-24.73813,1.79338s-15.20758,8.72639-16.654,16.9154'
							transform='translate(-127.5 -158.38785)'
							fill='#e6e6e6'
						/>
						<path
							id='fc4eb8ca-daad-4589-b224-2c71eec1c546-46'
							data-name='Path 443'
							d='M220.27955,740.05454c7.83972-13.87142,16.93235-29.28794,33.1808-34.21551A37.02589,37.02589,0,0,1,267.4158,704.398c1.4819.128,1.1118,2.41174-.367,2.28454a34.39824,34.39824,0,0,0-22.27164,5.89215c-6.27994,4.27453-11.16975,10.21755-15.30781,16.51907-2.5351,3.8605-4.80576,7.88445-7.07642,11.903C221.66738,742.28125,219.54555,741.35371,220.27955,740.05454Z'
							transform='translate(-127.5 -158.38785)'
							fill='#f2f2f2'
						/>
						<path
							id='ec83fa9a-7bb4-4b90-a90b-e1cec4444963-47'
							data-name='Path 442'
							d='M1008.35714,710.03894a17.82515,17.82515,0,0,1-17.065,3.78282c-7.50783-2.37076-12.4416-9.35006-16.813-15.89522l-12.93426-19.3574,11.30757,2.41744c8.132,1.73826,16.46493,3.55513,23.45819,8.05635s12.47224,12.32329,11.77771,20.61'
							transform='translate(-127.5 -158.38785)'
							fill='#e6e6e6'
						/>
						<path
							id='e32935a9-e392-46b4-9a67-68c65f1cc9fa-48'
							data-name='Path 443'
							d='M1017.53074,739.20841c-4.03412-15.41439-8.88464-32.64277-23.33408-41.55944a37.026,37.026,0,0,0-13.12367-4.9599c-1.46539-.255-1.69126,2.04749-.22905,2.30247a34.39822,34.39822,0,0,1,20.02606,11.3886c4.9789,5.73758,8.18741,12.733,10.57751,19.88279,1.46425,4.38021,2.63106,8.85084,3.79926,13.31624C1015.61991,741.00647,1017.90833,740.652,1017.53074,739.20841Z'
							transform='translate(-127.5 -158.38785)'
							fill='#f2f2f2'
						/>
						<path
							d='M858.65906,513.48057H594.33494a7.97081,7.97081,0,0,1-7.96157-7.96157V416.34942a7.97081,7.97081,0,0,1,7.96157-7.96157H858.65906a7.9707,7.9707,0,0,1,7.96157,7.96157V505.519A7.9707,7.9707,0,0,1,858.65906,513.48057Z'
							transform='translate(-127.5 -158.38785)'
							fill='#f1f1f1'
						/>
						<rect
							x='500.27353'
							y='273.88471'
							width='70.06181'
							height='7.96157'
							fill='#0098c7'
						/>
						<circle
							cx='662.68956'
							cy='278.66165'
							r='4.77694'
							fill='#0098c7'
						/>
						<circle
							cx='678.6127'
							cy='278.66165'
							r='4.77694'
							fill='#0098c7'
						/>
						<circle
							cx='694.53583'
							cy='278.66165'
							r='4.77694'
							fill='#0098c7'
						/>
						<path
							d='M858.65906,626.53486H594.33494a7.97081,7.97081,0,0,1-7.96157-7.96157V529.40371a7.97081,7.97081,0,0,1,7.96157-7.96157H858.65906a7.9707,7.9707,0,0,1,7.96157,7.96157v89.16958A7.9707,7.9707,0,0,1,858.65906,626.53486Z'
							transform='translate(-127.5 -158.38785)'
							fill='#f1f1f1'
						/>
						<rect
							x='500.27353'
							y='386.939'
							width='70.06181'
							height='7.96157'
							fill='#0098c7'
						/>
						<circle
							cx='662.68956'
							cy='391.71594'
							r='4.77694'
							fill='#0098c7'
						/>
						<circle
							cx='678.6127'
							cy='391.71594'
							r='4.77694'
							fill='#0098c7'
						/>
						<circle
							cx='694.53583'
							cy='391.71594'
							r='4.77694'
							fill='#0098c7'
						/>
						<path
							d='M858.65906,739.58915H594.33494a7.97081,7.97081,0,0,1-7.96157-7.96156V642.458a7.97081,7.97081,0,0,1,7.96157-7.96157H858.65906a7.9707,7.9707,0,0,1,7.96157,7.96157v89.16959A7.97069,7.97069,0,0,1,858.65906,739.58915Z'
							transform='translate(-127.5 -158.38785)'
							fill='#f1f1f1'
						/>
						<rect
							x='500.27353'
							y='499.99329'
							width='70.06181'
							height='7.96157'
							fill='#0098c7'
						/>
						<circle
							cx='662.68956'
							cy='504.77024'
							r='4.77694'
							fill='#0098c7'
						/>
						<circle
							cx='678.6127'
							cy='504.77024'
							r='4.77694'
							fill='#0098c7'
						/>
						<circle
							cx='694.53583'
							cy='504.77024'
							r='4.77694'
							fill='#0098c7'
						/>
						<path
							d='M759.01179,321.31453l-.29232-.216-.007-.00528a3.57626,3.57626,0,0,0-5.00334.73888L694.21319,401.9379h-6.54562v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.90531a1.43056,1.43056,0,0,0-1.43052,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43057,1.43057,0,0,0-1.43053-1.43052h-3.9053a1.43056,1.43056,0,0,0-1.43052,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052H655.259a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43057,1.43057,0,0,0-1.43053-1.43052h-3.9053a1.43034,1.43034,0,0,0-1.43052,1.43052v1.53783H642.5488v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052H637.213a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.26034v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.9053a1.43057,1.43057,0,0,0-1.43053,1.43052v1.53783h-2.253v-1.53783a1.43056,1.43056,0,0,0-1.43052-1.43052h-3.90531a1.43056,1.43056,0,0,0-1.43052,1.43052v1.53783H596.858a3.57618,3.57618,0,0,0-3.57631,3.57631V408.926a3.57618,3.57618,0,0,0,3.57631,3.57631h96.76151a5.32944,5.32944,0,0,0,5.21778-4.24744l.037.02751L759.74521,326.325l.00559-.00707A3.57671,3.57671,0,0,0,759.01179,321.31453Z'
							transform='translate(-127.5 -158.38785)'
							fill='#3f3d56'
						/>
						<polygon
							points='255.504 550.825 267.523 556.976 296.966 513.544 279.228 504.466 255.504 550.825'
							fill='#ffb7b7'
						/>
						<path
							d='M381.94612,703.72021l23.66983,12.113.001.00049a16.94563,16.94563,0,0,1,7.3641,22.8037l-.25087.49017-38.75427-19.83265Z'
							transform='translate(-127.5 -158.38785)'
							fill='#2f2e41'
						/>
						<polygon
							points='394.317 567.652 407.819 567.652 414.242 515.575 394.315 515.575 394.317 567.652'
							fill='#ffb7b7'
						/>
						<path
							d='M518.37323,721.632l26.58922-.00107h.00107a16.94563,16.94563,0,0,1,16.94473,16.94446v.55063l-43.53421.00162Z'
							transform='translate(-127.5 -158.38785)'
							fill='#2f2e41'
						/>
						<path
							d='M458.66285,301.26058s-9.0412-6.9268-9.0412,9.99291l-1.42756,55.91271,15.94107,52.81966,9.27913-17.1307-3.80682-37.11652Z'
							transform='translate(-127.5 -158.38785)'
							fill='#2f2e41'
						/>
						<path
							d='M555.37734,454.19165s10.48418,51.058-2.79579,92.95976l-7.33892,161.10695-26.90941-2.09684-9.43576-119.51969-9.0863-59.41037-18.87153,54.16828L418.73348,696.02681l-28.65677-22.36625s31.75629-86.64916,55.2167-104.84184l11.76615-134.011Z'
							transform='translate(-127.5 -158.38785)'
							fill='#2f2e41'
						/>
						<circle
							cx='523.48018'
							cy='202.31369'
							r='30.68251'
							transform='translate(-32.63308 406.2144) rotate(-61.33685)'
							fill='#ffb7b7'
						/>
						<path
							d='M521.30883,208.82157c3.67807.47856,6.45254-3.28467,7.73937-6.76336s2.2673-7.5286,5.46514-9.40772c4.36891-2.56725,9.95872.52048,14.95479-.32655,5.64211-.95654,9.31053-6.93607,9.598-12.65146s-1.987-11.21239-4.21862-16.48193l-.77911,6.54884a12.98679,12.98679,0,0,0-5.67512-11.35154l1.00419,9.60941A10.199,10.199,0,0,0,537.6641,159.558l.15814,5.72564c-6.51663-.77489-13.09021-1.55087-19.62615-.96052s-13.11751,2.65828-18.0712,6.96269c-7.40994,6.43874-10.11621,17.04088-9.20765,26.81529s4.94341,18.95675,9.14865,27.827c1.058,2.23177,2.52146,4.75016,4.97491,5.03445,2.20445.25544,4.22155-1.58732,4.90683-3.698a13.40422,13.40422,0,0,0-.0595-6.58474c-.62-3.2946-1.40155-6.6621-.81863-9.96346s2.9579-6.56372,6.28582-6.96831,6.73322,3.3994,5.13321,6.34537Z'
							transform='translate(-127.5 -158.38785)'
							fill='#2f2e41'
						/>
						<polygon
							points='429.776 309.458 327.357 302.85 335.066 270.913 428.674 291.838 429.776 309.458'
							fill='#cbcbcb'
						/>
						<path
							d='M494.11389,244.15824l6.424-8.91878s7.18028,2.44014,26.40983,12.01183l1.35857,8.35615L561.685,460.9092,501.01375,458.292l-16.5219-.35153-5.4068-12.12-6.66725,11.86313-16.13421-.34328-16.41693-9.51706,16.179-49.48869,5.23438-45.206-8.0895-42.58883s-10.17937-39.10848,29.027-60.19538Z'
							transform='translate(-127.5 -158.38785)'
							fill='#2f2e41'
						/>
						<path
							d='M630.86271,399.57305a10.48605,10.48605,0,0,1-13.04108-9.40577L581.82654,380.526l14.48005-12.85707,31.9616,11.12669a10.54289,10.54289,0,0,1,2.59452,20.77747Z'
							transform='translate(-127.5 -158.38785)'
							fill='#ffb7b7'
						/>
						<path
							d='M614.74112,394.13009a6.14221,6.14221,0,0,1-4.987.39563l-59.21317-22.47383a63.2273,63.2273,0,0,1-34.03214-28.68449l-24.6929-44.04893a19.76509,19.76509,0,1,1,29.49118-26.323L564.04672,340.737l53.7869,31.53448a6.15547,6.15547,0,0,1,2.61747,6.54608l-2.67464,11.33426a6.1431,6.1431,0,0,1-1.86626,3.15032A6.07364,6.07364,0,0,1,614.74112,394.13009Z'
							transform='translate(-127.5 -158.38785)'
							fill='#2f2e41'
						/>
						<path
							d='M1071.5,741.38785h-943a1,1,0,0,1,0-2h943a1,1,0,0,1,0,2Z'
							transform='translate(-127.5 -158.38785)'
							fill='#cbcbcb'
						/>
					</svg>
					<p className='mt-8'>
						Currently, We are down for a bit of maintenance.
					</p>
					<small>
						We'll be back up and running again shortly, Thanks for
						your patience.
					</small>
				</div>
			</div>
		);
	};

	const errorMode = message => {
		return (
			<div className='font-poppins border border-black/20 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100dvh]'>
				<div className='flex flex-col items-center py-8'>
					<img src={Logo} width={100} alt='Logo' />
					<h2 className='mt-8 text-4xl font-extrabold'>
						Ohh... SH*T
					</h2>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						data-name='Layer 1'
						viewBox='0 0 1119.60911 699'
						className='w-full max-w-[420px] mt-6'
						xmlnsXlink='http://www.w3.org/1999/xlink'
					>
						<circle
							cx='292.60911'
							cy={213}
							r={213}
							fill='#f2f2f2'
						/>
						<path
							d='M31.39089,151.64237c0,77.49789,48.6181,140.20819,108.70073,140.20819'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M140.09162,291.85056c0-78.36865,54.255-141.78356,121.30372-141.78356'
							transform='translate(-31.39089 -100.5)'
							fill='#0098c7'
						/>
						<path
							d='M70.77521,158.66768c0,73.61476,31.00285,133.18288,69.31641,133.18288'
							transform='translate(-31.39089 -100.5)'
							fill='#0098c7'
						/>
						<path
							d='M140.09162,291.85056c0-100.13772,62.7103-181.16788,140.20819-181.16788'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M117.22379,292.83905s15.41555-.47479,20.06141-3.783,23.713-7.2585,24.86553-1.95278,23.16671,26.38821,5.76263,26.5286-40.43935-2.711-45.07627-5.53549S117.22379,292.83905,117.22379,292.83905Z'
							transform='translate(-31.39089 -100.5)'
							fill='#a8a8a8'
						/>
						<path
							d='M168.224,311.78489c-17.40408.14042-40.43933-2.71094-45.07626-5.53548-3.53126-2.151-4.93843-9.86945-5.40926-13.43043-.32607.014-.51463.02-.51463.02s.97638,12.43276,5.61331,15.2573,27.67217,5.67589,45.07626,5.53547c5.02386-.04052,6.7592-1.82793,6.66391-4.47526C173.87935,310.756,171.96329,311.75474,168.224,311.78489Z'
							transform='translate(-31.39089 -100.5)'
							opacity='0.2'
						/>
						<ellipse
							cx='198.60911'
							cy='424.5'
							rx={187}
							ry='25.43993'
							fill='#3f3d56'
						/>
						<ellipse
							cx='198.60911'
							cy='424.5'
							rx={157}
							ry='21.35866'
							opacity='0.1'
						/>
						<ellipse
							cx='836.60911'
							cy='660.5'
							rx={283}
							ry='38.5'
							fill='#3f3d56'
						/>
						<ellipse
							cx='310.60911'
							cy='645.5'
							rx={170}
							ry='23.12721'
							fill='#3f3d56'
						/>
						<path
							d='M494,726.5c90,23,263-30,282-90'
							transform='translate(-31.39089 -100.5)'
							fill='none'
							stroke='#2f2e41'
							strokeMiterlimit={10}
							strokeWidth={2}
						/>
						<path
							d='M341,359.5s130-36,138,80-107,149-17,172'
							transform='translate(-31.39089 -100.5)'
							fill='none'
							stroke='#2f2e41'
							strokeMiterlimit={10}
							strokeWidth={2}
						/>
						<path
							d='M215.40233,637.78332s39.0723-10.82,41.47675,24.04449-32.15951,44.78287-5.10946,51.69566'
							transform='translate(-31.39089 -100.5)'
							fill='none'
							stroke='#2f2e41'
							strokeMiterlimit={10}
							strokeWidth={2}
						/>
						<path
							d='M810.09554,663.73988,802.218,714.03505s-38.78182,20.60284-11.51335,21.20881,155.73324,0,155.73324,0,24.84461,0-14.54318-21.81478l-7.87756-52.719Z'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M785.21906,734.69812c6.193-5.51039,16.9989-11.252,16.9989-11.252l7.87756-50.2952,113.9216.10717,7.87756,49.582c9.185,5.08711,14.8749,8.987,18.20362,11.97818,5.05882-1.15422,10.58716-5.44353-18.20362-21.38921l-7.87756-52.719-113.9216,3.02983L802.218,714.03506S769.62985,731.34968,785.21906,734.69812Z'
							transform='translate(-31.39089 -100.5)'
							opacity='0.1'
						/>
						<rect
							x='578.43291'
							y='212.68859'
							width='513.25314'
							height='357.51989'
							rx='18.04568'
							fill='#2f2e41'
						/>
						<rect
							x='595.70294'
							y='231.77652'
							width='478.71308'
							height='267.83694'
							fill='#3f3d56'
						/>
						<circle
							cx='835.05948'
							cy='223.29299'
							r='3.02983'
							fill='#f2f2f2'
						/>
						<path
							d='M1123.07694,621.32226V652.6628a18.04341,18.04341,0,0,1-18.04568,18.04568H627.86949A18.04341,18.04341,0,0,1,609.8238,652.6628V621.32226Z'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<polygon
							points='968.978 667.466 968.978 673.526 642.968 673.526 642.968 668.678 643.417 667.466 651.452 645.651 962.312 645.651 968.978 667.466'
							fill='#2f2e41'
						/>
						<path
							d='M1125.828,762.03359c-.59383,2.539-2.83591,5.21743-7.90178,7.75032-18.179,9.08949-55.1429-2.42386-55.1429-2.42386s-28.4804-4.84773-28.4804-17.573a22.72457,22.72457,0,0,1,2.49658-1.48459c7.64294-4.04351,32.98449-14.02122,77.9177.42248a18.73921,18.73921,0,0,1,8.54106,5.59715C1125.07908,756.45353,1126.50669,759.15715,1125.828,762.03359Z'
							transform='translate(-31.39089 -100.5)'
							fill='#2f2e41'
						/>
						<path
							d='M1125.828,762.03359c-22.251,8.526-42.0843,9.1622-62.43871-4.975-10.26507-7.12617-19.59089-8.88955-26.58979-8.75618,7.64294-4.04351,32.98449-14.02122,77.9177.42248a18.73921,18.73921,0,0,1,8.54106,5.59715C1125.07908,756.45353,1126.50669,759.15715,1125.828,762.03359Z'
							transform='translate(-31.39089 -100.5)'
							opacity='0.1'
						/>
						<ellipse
							cx='1066.53846'
							cy='654.13477'
							rx='7.87756'
							ry='2.42386'
							fill='#f2f2f2'
						/>
						<circle
							cx='835.05948'
							cy='545.66686'
							r='11.51335'
							fill='#f2f2f2'
						/>
						<polygon
							points='968.978 667.466 968.978 673.526 642.968 673.526 642.968 668.678 643.417 667.466 968.978 667.466'
							opacity='0.1'
						/>
						<rect
							x='108.60911'
							y={159}
							width={208}
							height={242}
							fill='#2f2e41'
						/>
						<rect
							x='87.60911'
							y={135}
							width={250}
							height={86}
							fill='#3f3d56'
						/>
						<rect
							x='87.60911'
							y={237}
							width={250}
							height={86}
							fill='#3f3d56'
						/>
						<rect
							x='87.60911'
							y={339}
							width={250}
							height={86}
							fill='#3f3d56'
						/>
						<rect
							x='271.60911'
							y={150}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.4'
						/>
						<rect
							x='294.60911'
							y={150}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.8'
						/>
						<rect
							x='317.60911'
							y={150}
							width={16}
							height={16}
							fill='#0098c7'
						/>
						<rect
							x='271.60911'
							y={251}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.4'
						/>
						<rect
							x='294.60911'
							y={251}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.8'
						/>
						<rect
							x='317.60911'
							y={251}
							width={16}
							height={16}
							fill='#0098c7'
						/>
						<rect
							x='271.60911'
							y={352}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.4'
						/>
						<rect
							x='294.60911'
							y={352}
							width={16}
							height={16}
							fill='#0098c7'
							opacity='0.8'
						/>
						<rect
							x='317.60911'
							y={352}
							width={16}
							height={16}
							fill='#0098c7'
						/>
						<circle cx='316.60911' cy={538} r={79} fill='#2f2e41' />
						<rect
							x='280.60911'
							y={600}
							width={24}
							height={43}
							fill='#2f2e41'
						/>
						<rect
							x='328.60911'
							y={600}
							width={24}
							height={43}
							fill='#2f2e41'
						/>
						<ellipse
							cx='300.60911'
							cy='643.5'
							rx={20}
							ry='7.5'
							fill='#2f2e41'
						/>
						<ellipse
							cx='348.60911'
							cy='642.5'
							rx={20}
							ry='7.5'
							fill='#2f2e41'
						/>
						<circle cx='318.60911' cy={518} r={27} fill='#fff' />
						<circle cx='318.60911' cy={518} r={9} fill='#3f3d56' />
						<path
							d='M271.36733,565.03228c-6.37889-28.56758,14.01185-57.43392,45.544-64.47477s62.2651,10.41,68.644,38.9776-14.51861,39.10379-46.05075,46.14464S277.74622,593.59986,271.36733,565.03228Z'
							transform='translate(-31.39089 -100.5)'
							fill='#0098c7'
						/>
						<ellipse
							cx='417.21511'
							cy='611.34365'
							rx='39.5'
							ry='12.40027'
							transform='translate(-238.28665 112.98044) rotate(-23.17116)'
							fill='#2f2e41'
						/>
						<ellipse
							cx='269.21511'
							cy='664.34365'
							rx='39.5'
							ry='12.40027'
							transform='translate(-271.07969 59.02084) rotate(-23.17116)'
							fill='#2f2e41'
						/>
						<path
							d='M394,661.5c0,7.732-19.90861,23-42,23s-43-14.268-43-22,20.90861-6,43-6S394,653.768,394,661.5Z'
							transform='translate(-31.39089 -100.5)'
							fill='#fff'
						/>
					</svg>

					<p className='mt-8'>Something went wrong.</p>
					<small>{message}</small>
				</div>
			</div>
		);
	};

	const holiday = () => {
		return (
			<div className='font-poppins border border-black/20 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100dvh]'>
				<div className='flex flex-col items-center py-8 px-2 text-center'>
					<img src={Logo} width={100} alt='Logo' />
					<h2 className='mt-8 text-4xl font-extrabold mb-5'>Today Holiday!</h2>
					<img src={happyHolidayImg} alt="happyHolidayImg" style={{ width:'220px', borderRadius:'15px' }} />
					<p className='mt-8'>Our team is currently on a short holiday break to celebrate with friends and family.</p>
					<small>We'll be back soon, refreshed and ready to serve you better. Thank you for your understanding and support!</small>
				</div>
			</div>
		);
	};

	// Puser Notification
	// const pusher = new Pusher('0de3e40f927595cb5f0e', {
	// 	cluster: 'ap2',
	// 	encrypted: true,
	// });
	// const channel = pusher.subscribe('notifications');
	// channel.bind('App\\Events\\NotificationCreated', function(data) {
	// 	console.log("Title:", data.notification.title);
	// 	console.log("Description:", data.notification.description);
	// 	// alert(`📢 ${data.notification.title}\n${data.notification.description}`);
	// 	Swal.fire({
	// 		title: data.notification.title,
	// 		text: data.notification.description,
	// 		icon: 'info',
	// 		showConfirmButton: true,
	// 		confirmButtonText: 'OK'
	// 	});
	// 	// Swal.fire({
	// 	// 	toast: true,
	// 	// 	position: 'top-end',
	// 	// 	icon: 'info',
	// 	// 	title: data.notification.title,
	// 	// 	text: data.notification.description,
	// 	// 	showConfirmButton: false,
	// 	// 	timer: 5000,
	// 	// 	timerProgressBar: true,
	// 	// 	didOpen: (toast) => {
	// 	// 		toast.addEventListener('mouseenter', Swal.stopTimer)
	// 	// 		toast.addEventListener('mouseleave', Swal.resumeTimer)
	// 	// 	}
	// 	// });
	// });



	return loading ? (
		<div className='flex justify-center items-center h-[100dvh]'>
			<Splash />
		</div>
	) : error !== '' ? (
		errorMode(error)
	) : appData?.maintain_mode !== 0 ? (
		maintenanceMode()
	) : appData?.holiday === 1 ? (
		holiday()	
	) : (
		<>
			<ToastContainer />
			<DeferredPromptContextProvider
				value={{
					deferredPrompt,
					setDeferredPrompt,
				}}
			>
				<ModalContextProvider
					value={{
						isSuccessModalOpen,
						setSuccessModalOpen,
						successMessage,
						setSuccessMessage,
						toggleSuccessModalOpen,
					}}
				>
					<RouterProvider router={router} />
				</ModalContextProvider>
			</DeferredPromptContextProvider>
			<Modal isOpen={isOpen} toggle={toggle}>
				<div className='font-semibold text-white bg-primary'>
					<div className='flex justify-end p-3 border-b border-white'>
						<button onClick={toggle}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke-width='1.5'
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									d='M6 18 18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
					<div className='p-3 pb-1 text-center text-md'>
						{appData.info_dialog_message}
					</div>
					<div className='flex items-center justify-center gap-4 p-3 py-1'>
						<a
							href={`https://wa.me/${appData.whatsapp_number}`}
							className='flex items-center justify-center w-16 h-16 font-bold text-white bg-red-600 rounded-full'
						>
							<i className='text-2xl fab fa-whatsapp'></i>
						</a>
						<div className='w-24 h-24'>
							<img
								src={Logo}
								alt='Logo'
								className='w-full h-full'
							/>
						</div>
						<a
							href={`tel:${appData.support_number}`}
							className='flex items-center justify-center w-16 h-16 font-bold text-white bg-red-600 rounded-full'
						>
							<i className='text-2xl fas fa-phone'></i>
						</a>
					</div>
					<div className='p-3 pt-1 text-center'>
						{appData.info_dialog_bottom_text}
					</div>
				</div>
			</Modal>
			<Modal isOpen={isSuccessModalOpen} toggle={toggleSuccessModalOpen}>
				<div className='font-semibold text-black bg-white'>
					<div className='flex justify-end p-3 border-b border-black'>
						<button onClick={toggleSuccessModalOpen}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke-width='1.5'
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									d='M6 18 18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
					<div className='p-5 px-3 flex flex-col items-center'>
						<i className='far text-8xl text-green-500 fa-check-circle'></i>
						<span className='mt-10'>{successMessage}</span>
						<button
							onClick={toggleSuccessModalOpen}
							className='px-8 py-2 mt-4 rounded-md bg-green-400'
						>
							OK
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default App;
