import React from 'react';
import WalletContextProvider from './WalletContextProvider';
import TransferSOL from './TransferSOL';

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <div className="App">
        <TransferSOL />
      </div>
    </WalletContextProvider>
  );
}

export default App;