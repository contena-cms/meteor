export type RecordValue = string | number | boolean | null;

export interface DemoRecord {
  id: string;
  [key: string]: RecordValue | string[];
}

export interface QueryState {
  search: string;
  filters: Record<string, string>;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
  page: number;
  limit: number;
}

export interface NavigationItem {
  label: string;
  path: string;
}

export interface NavigationGroup {
  label: string;
  icon: string;
  children: NavigationItem[];
  isPrimary?: boolean;
}
