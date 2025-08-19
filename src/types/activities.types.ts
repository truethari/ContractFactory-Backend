export interface IActivity {
  id: string;
  description: string;
  timestamp: number;
  wallet: string;
}

export interface ICreateActivity {
  description: string;
  wallet: string;
}
