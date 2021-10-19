import { ReactNode } from "react";

export declare interface ILeaf {
  id: string;
  label: string;
  children?: ILeaf[];
  load?: boolean;
}

export declare interface IOption {
  label: string,
  icon: ReactNode | string;
  onClick(): void;
}

export declare interface IPxpTree {
  data: ILeaf[];
  enableChecked?: boolean;
  render?(node: ILeaf): ReactNode;
  options?: IOption[];
  onLoadChildren?(nodeId: string): any;
  onSelectedNodes?(nodes: string[]): any;
}