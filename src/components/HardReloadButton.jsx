import React, { useState } from 'react';

const SPIN_KEYFRAMES_NAME = 'hardReloadButtonSpin';

export default function HardReloadButton() {
	const [spinning, setSpinning] = useState(false);

	const onHardReload = async () => {
		if (spinning) return;
		setSpinning(true);

		// Let the spinner paint before we do async work.
		await new Promise(requestAnimationFrame);

		try {
			if ('caches' in window) {
				const names = await window.caches.keys();
				await Promise.all(names.map(name => window.caches.delete(name)));
			}
		} catch {
			// Best-effort cache clear; still proceed to reload.
		}

		window.location.href =
			window.location.origin + '?v=' + Date.now().toString(10);
	};

	const buttonStyle = {
		position: 'fixed',
		left: 10,
		top: '50%',
		transform: 'translateY(-50%)',
		zIndex: 9999,
		width: 40,
		height: 40,
		borderRadius: '50%',
		border: '1px solid rgba(0,0,0,0.12)',
		background: 'rgba(255,255,255,0.92)',
		backdropFilter: 'blur(8px)',
		WebkitBackdropFilter: 'blur(8px)',
		boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: spinning ? 'default' : 'pointer',
		userSelect: 'none',
		padding: 0,
		outline: 'none',
	};

	const iconStyle = {
		width: 18,
		height: 18,
		color: '#111827',
		animation: spinning ? `${SPIN_KEYFRAMES_NAME} 0.8s linear infinite` : 'none',
	};

	return (
		<>
			<style>{`
        @keyframes ${SPIN_KEYFRAMES_NAME} {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
			<button
				type='button'
				onClick={onHardReload}
				disabled={spinning}
				aria-label='Hard reload'
				title='Hard reload'
				style={buttonStyle}
			>
				<svg
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					style={iconStyle}
				>
					<path
						d='M20 12a8 8 0 1 1-2.343-5.657'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
					/>
					<path
						d='M20 4v6h-6'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</button>
		</>
	);
}

