import React, { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const TransferSOL: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleTransfer = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('');

    if (!publicKey) {
      setStatus('Wallet not connected');
      return;
    }

    try {
      const recipientPubKey = new PublicKey(recipient);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: LAMPORTS_PER_SOL * parseFloat(amount)
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setStatus(`Transfer successful! Signature: ${signature}`);
      setRecipient('');
      setAmount('');
    } catch (error) {
      setStatus(`Transfer failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transfer SOL</h1>
      <WalletMultiButton className="mb-4" />
      {publicKey ? (
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block mb-1">Recipient Address:</label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient's Solana address"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block mb-1">Amount (SOL):</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in SOL"
              step="0.000000001"
              min="0"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Transfer SOL</button>
        </form>
      ) : (
        <p>Please connect your wallet to make a transfer.</p>
      )}
      {status && (
        <div className={`mt-4 p-2 rounded ${status.includes('failed') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default TransferSOL;