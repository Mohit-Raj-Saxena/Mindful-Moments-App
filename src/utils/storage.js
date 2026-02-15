import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mindful_entries';

export const saveEntry = async (entry) => {
  try {
    const existingEntries = await getEntries();
    const newEntries = [entry, ...existingEntries];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    return newEntries;
  } catch (error) {
    console.error('Error saving entry:', error);
    throw error;
  }
};

export const getEntries = async () => {
  try {
    const entries = await AsyncStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error getting entries:', error);
    return [];
  }
};

export const deleteEntry = async (entryId) => {
  try {
    const entries = await getEntries();
    const filtered = entries.filter(entry => entry.id !== entryId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};

export const clearAllEntries = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing entries:', error);
    throw error;
  }
};