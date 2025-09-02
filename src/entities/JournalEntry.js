export const JournalEntry = {
  async list(_sort = null, limit = null) {
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    if (limit) return entries.slice(0, limit);
    return entries;
  },

  async create(entry) {
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const newEntry = { id: Date.now().toString(), ...entry };
    entries.unshift(newEntry);
    localStorage.setItem("journalEntries", JSON.stringify(entries));
    return newEntry;
  },

  async update(id, updatedFields) {
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const idx = entries.findIndex((e) => e.id === id || e.id == id);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], ...updatedFields };
      localStorage.setItem("journalEntries", JSON.stringify(entries));
      return entries[idx];
    }
    return null;
  }
};
