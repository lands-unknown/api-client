export type PingResponse = PingSuccess | PingError;

export interface PingSuccess {
  success: true;
  count: number;
}

export interface PingError {
  success: false;
}
