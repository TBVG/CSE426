
declare module 'react-blockies' {
  import * as React from 'react';
  
  export interface BlockiesProps {
    seed?: string;
    size?: number;
    scale?: number;
    color?: string;
    bgColor?: string;
    spotColor?: string;
    className?: string;
  }

  export default class Blockies extends React.Component<BlockiesProps> {}
}
