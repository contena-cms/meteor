import type { DemoRecord, QueryState } from "~/types";

export function queryRecords<T extends DemoRecord>(records: T[], state: QueryState, searchable: string[]) {
  const term = state.search.trim().toLocaleLowerCase("zh-CN");
  let result = records.filter((record) => {
    const matchesSearch = !term || searchable.some((key) => String(record[key] ?? "").toLocaleLowerCase("zh-CN").includes(term));
    const matchesFilters = Object.entries(state.filters).every(([key, value]) => !value || String(record[key]) === value);
    return matchesSearch && matchesFilters;
  });

  if (state.sortBy) {
    result = [...result].sort((left, right) => {
      const a = left[state.sortBy] ?? "";
      const b = right[state.sortBy] ?? "";
      const comparison = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), "zh-CN", { numeric: true });
      return state.sortDirection === "ASC" ? comparison : -comparison;
    });
  }

  const total = result.length;
  const start = (state.page - 1) * state.limit;
  return { total, items: result.slice(start, start + state.limit) };
}

export function useDemoRepository<T extends DemoRecord>(key: string, seed: T[]) {
  const records = useState<T[]>(`demo-repository-${key}`, () => structuredClone(seed));

  function add(record: T) { records.value.unshift(structuredClone(record)); }
  function update(id: string, changes: Partial<T>) {
    const index = records.value.findIndex((record) => record.id === id);
    if (index >= 0) records.value[index] = { ...records.value[index]!, ...changes };
  }
  function remove(ids: string[]) { records.value = records.value.filter((record) => !ids.includes(record.id)); }
  function bulkUpdate(ids: string[], changes: Partial<T>) { ids.forEach((id) => update(id, changes)); }
  function reset() { records.value = structuredClone(seed); }

  return { records, add, update, remove, bulkUpdate, reset };
}
