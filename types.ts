
export enum Status {
  PENDING = 'PENDING',
  READY = 'READY',
  INCOMPLETE = 'INCOMPLETE'
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
}
