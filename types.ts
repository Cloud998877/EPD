
export enum Status {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  SUPPLEMENT = 'SUPPLEMENT',
  FINAL_READY = 'FINAL_READY'
}

export type LogType = 'STATUS' | 'INQUIRY' | 'ANSWER' | 'SYSTEM';

export interface LogEntry {
  id: string;
  type: LogType;
  content: string;
  timestamp: string;
  author: '엔디넥스' | '고객사';
}

export interface ChecklistItem {
  id: string;
  category1: string;
  category2?: string;
  category3?: string;
  category4?: string;
  requiredDocs: string;
  description: string;
  isImportant?: boolean;
  status: Status;
  supplementNote?: string;
  logs: LogEntry[];
}
