import React from 'react';

const ModalContext = React.createContext(null);
const ModalContextProvider = ModalContext.Provider;
const ModalContextConsumer = ModalContext.Consumer;

export { ModalContext, ModalContextProvider, ModalContextConsumer };
