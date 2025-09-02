export const MoodEntry = {
  async list(_sort = "-date", limit = null) {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    // sort newest-first if requested
    if (_sort && _sort.startsWith("-")) {
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (limit) return entries.slice(0, limit);
    return entries;
  },

  async create(entry) {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const newEntry = { id: Date.now().toString(), ...entry };
    entries.unshift(newEntry);
    localStorage.setItem("moodEntries", JSON.stringify(entries));
    return newEntry;
  },

  async update(id, updatedFields) {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
    const idx = entries.findIndex((e) => e.id === id || e.id == id);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], ...updatedFields };
      localStorage.setItem("moodEntries", JSON.stringify(entries));
      return entries[idx];
    }
    return null;
  }
};
