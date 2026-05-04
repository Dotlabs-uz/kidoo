import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChildSession {
  familyId: string;
  childId: string;
}

const KEY = 'kidoo_child_session';

export const storage = {
  saveChild: (s: ChildSession) => AsyncStorage.setItem(KEY, JSON.stringify(s)),
  loadChild: async (): Promise<ChildSession | null> => {
    try {
      const v = await AsyncStorage.getItem(KEY);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  clearChild: () => AsyncStorage.removeItem(KEY),
};
