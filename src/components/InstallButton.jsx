import React, { useContext } from 'react';
import { DeferredPromptContext } from '../context/DeferredPromptContext';

const InstallButton = () => {
    let { deferredPrompt, setDeferredPrompt } = useContext(DeferredPromptContext)

    const handleInstallClick = async () => {
        console.log("button clicked")
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            setDeferredPrompt(null);
        }
    };

    return (
        <button onClick={handleInstallClick} disabled={!deferredPrompt} className="p-3 disabled:cursor-not-allowed disabled:bg-orange/75 mt-4 w-full font-semibold text-white rounded-md bg-orange">
            Install Web Application
        </button>
    );
};

export default InstallButton;
