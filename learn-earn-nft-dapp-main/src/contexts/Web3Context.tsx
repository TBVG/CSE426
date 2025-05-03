
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
// Import contract artifact from our mock file
import StudyToEarnNFTArtifact from '../artifacts/contracts/StudyToEarnNFT.sol/StudyToEarnNFT.json';
// Import contract address
import contractAddresses from '../contracts/contract-address.json';

interface Web3ContextType {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  nftContract: ethers.Contract | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  nftContract: null,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  // Contract address - in a real app this would come from environment vars or a config file
  const contractAddress = contractAddresses.StudyToEarnNFT;

  // Update last activity time on user interactions
  useEffect(() => {
    // Track user activity
    const updateLastActivity = () => {
      setLastActivity(Date.now());
    };

    // Add event listeners for user activity
    window.addEventListener('mousedown', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('touchstart', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);

    return () => {
      // Clean up event listeners
      window.removeEventListener('mousedown', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('touchstart', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
    };
  }, []);

  // Check for inactivity and disconnect wallet after 5 minutes
  useEffect(() => {
    if (!account) {
      // No need to check inactivity if not connected
      if (inactivityTimer) {
        clearInterval(inactivityTimer);
        setInactivityTimer(null);
      }
      return;
    }

    // Create inactivity timer
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;
      
      // Disconnect after 5 minutes (300000 ms) of inactivity
      if (inactiveTime >= 300000) {
        toast.info("Disconnected due to inactivity");
        disconnectWallet();
      }
    }, 30000); // Check every 30 seconds

    setInactivityTimer(timer);

    return () => {
      clearInterval(timer);
    };
  }, [account, lastActivity]);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload();
      });
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  useEffect(() => {
    // Initialize contract if provider and signer are available
    if (provider && signer && contractAddress) {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          StudyToEarnNFTArtifact.abi,
          signer
        );
        setNftContract(contract);
      } catch (error) {
        console.error("Failed to initialize contract:", error);
        toast.error("Failed to initialize contract. Please check console for details.");
      }
    }
  }, [provider, signer, contractAddress]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setConnecting(true);
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const userAccount = accounts[0];
        const network = await web3Provider.getNetwork();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(userAccount);
        setChainId(network.chainId);
        
        // Reset last activity timer
        setLastActivity(Date.now());
        
        toast.success("Wallet connected successfully!");
        
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        toast.error("Failed to connect wallet. Please check console for details.");
      } finally {
        setConnecting(false);
      }
    } else {
      toast.error("MetaMask is not installed. Please install MetaMask to use this application.");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setNftContract(null);
    
    // Clear the inactivity timer
    if (inactivityTimer) {
      clearInterval(inactivityTimer);
      setInactivityTimer(null);
    }
  };

  const value = {
    provider,
    signer,
    account,
    chainId,
    nftContract,
    connecting,
    connectWallet,
    disconnectWallet,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
