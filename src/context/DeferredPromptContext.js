import React from 'react';

const DeferredPromptContext = React.createContext(null);
const DeferredPromptContextProvider = DeferredPromptContext.Provider;
const DeferredPromptContextConsumer = DeferredPromptContext.Consumer;

export {
	DeferredPromptContext,
	DeferredPromptContextProvider,
	DeferredPromptContextConsumer,
};
