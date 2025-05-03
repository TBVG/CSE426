
import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress } from '@/utils/formatters';
import Blockies from 'react-blockies';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Clock } from 'lucide-react';

const ConnectWallet: React.FC = () => {
  const { account, connectWallet, disconnectWallet, connecting } = useWeb3();

  return (
    <div className="flex items-center gap-2">
      {account ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 py-1 px-4 border rounded-full bg-white shadow-sm hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="rounded-full overflow-hidden w-6 h-6">
                <Blockies
                  seed={account.toLowerCase()}
                  size={8}
                  scale={3}
                  className="rounded-full"
                />
              </div>
              <span className="text-sm font-medium">{formatAddress(account)}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={disconnectWallet}>
              <LogOut className="h-4 w-4 mr-1" /> Disconnect
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-muted-foreground flex items-center gap-2" disabled>
              <Clock className="h-3 w-3 mr-1" /> Auto-disconnect after 5 min inactivity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={connectWallet} 
          disabled={connecting} 
          className="bg-study-blue hover:bg-study-blue-dark text-white"
        >
          {connecting ? <Skeleton className="w-24 h-4" /> : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
