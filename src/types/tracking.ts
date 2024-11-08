export interface TrackingInfo {
  number: string;
  carrier?: string;
  status?: string;
  lastUpdate?: string;
}

export interface TrackingUpdate {
  status: string;
  location?: string;
  timestamp: string;
  description?: string;
}

export interface TrackingResponse {
  code: number;
  data: {
    accepted: boolean;
    number: string;
    carrier?: string;
    tracking?: {
      status: string;
      updates: TrackingUpdate[];
    };
  }[];
  message: string;
}