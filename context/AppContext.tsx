import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { storage } from '../lib/storage';
import { Child, Family, Reward, Task } from '../types';

interface Celebration {
  stars: number;
  prize?: string;
}

interface AppState {
  loading: boolean;
  mode: 'parent' | 'child' | null;
  parentEmail: string;

  family: Family;
  children: Child[];
  child: Child;
  tasks: Task[];
  rewards: Reward[];
  celebration: Celebration | null;
  showLock: boolean;

  registerParent: (name: string, email: string, password: string) => Promise<void>;
  loginParent: (email: string, password: string) => Promise<void>;
  verifyParentPassword: (password: string) => Promise<boolean>;
  loginAsChild: (code: string, childId: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;

  setFamily: (f: Family) => void;
  setChild: (c: Child) => void;
  addChild: (c: Child) => Promise<void>;
  setCelebration: (c: Celebration | null) => void;
  setShowLock: (v: boolean) => void;

  addTask: (task: Task) => Promise<void>;
  approveTask: (id: string) => Promise<void>;
  completeChildTask: (id: string) => Promise<void>;
  addReward: (reward: Reward) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
  claimPrize: (id: string) => Promise<void>;
}

const EMPTY_FAMILY: Family = { id: '', parent_name: '', code: '' };

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'parent' | 'child' | null>(null);
  const [parentEmail, setParentEmail] = useState('');
  const [family, setFamilyState] = useState<Family>(EMPTY_FAMILY);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [showLock, setShowLock] = useState(false);

  const child = childrenList.find(c => c.id === activeChildId) ?? childrenList[0] ?? ({ id: '', family_id: '', name: '', avatar: 'fox', stars: 0, streak: 0 } as Child);

  const loadFamilyData = async (familyId: string) => {
    const [famRes, kidsRes, tasksRes, rewardsRes] = await Promise.all([
      supabase.from('families').select('*').eq('id', familyId).single(),
      supabase.from('children').select('*').eq('family_id', familyId),
      supabase.from('tasks').select('*').eq('family_id', familyId).order('created_at', { ascending: false }),
      supabase.from('rewards').select('*').eq('family_id', familyId),
    ]);
    if (famRes.data) setFamilyState(famRes.data);
    if (kidsRes.data) setChildrenList(kidsRes.data);
    if (tasksRes.data) setTasks(tasksRes.data);
    if (rewardsRes.data) setRewards(rewardsRes.data);
  };

  // Restore session on app start
  useEffect(() => {
    const init = async () => {
      // 1. Check parent Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: fam } = await supabase.from('families').select('*').eq('user_id', session.user.id).single();
        if (fam) {
          await loadFamilyData(fam.id);
          setParentEmail(session.user.email ?? '');
          setMode('parent');
          setLoading(false);
          return;
        }
      }

      // 2. Check child session in AsyncStorage
      const childSession = await storage.loadChild();
      if (childSession) {
        await loadFamilyData(childSession.familyId);
        setActiveChildId(childSession.childId);
        setMode('child');
        setLoading(false);
        return;
      }

      setMode(null);
      setLoading(false);
    };

    init();

    // Listen for auth state changes (parent sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: fam } = await supabase.from('families').select('*').eq('user_id', session.user.id).single();
        if (fam) {
          await loadFamilyData(fam.id);
          setParentEmail(session.user.email ?? '');
          setMode('parent');
        }
      } else if (event === 'SIGNED_OUT') {
        resetState();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const resetState = () => {
    setMode(null);
    setFamilyState(EMPTY_FAMILY);
    setChildrenList([]);
    setTasks([]);
    setRewards([]);
    setActiveChildId('');
  };

  // ── Auth ──────────────────────────────────────────────────────────────────

  const registerParent = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error('Не удалось создать аккаунт. Проверьте email.');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const { data: fam, error: famErr } = await supabase
      .from('families')
      .insert({ user_id: userId, parent_name: name, code })
      .select('*')
      .single();
    if (famErr) throw famErr;

    setFamilyState(fam);
    setMode('parent');
  };

  const loginParent = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setParentEmail(email);
  };

  const verifyParentPassword = async (password: string): Promise<boolean> => {
    if (!parentEmail) return false;
    const { error } = await supabase.auth.signInWithPassword({ email: parentEmail, password });
    return !error;
  };

  const loginAsChild = async (code: string, childId: string): Promise<{ error?: string }> => {
    const { data: fam, error } = await supabase.from('families').select('*').eq('code', code).single();
    if (error || !fam) return { error: 'Семья не найдена. Проверь код.' };

    const { data: kid } = await supabase.from('children').select('*').eq('id', childId).maybeSingle();
    if (!kid) return { error: 'Профиль не найден.' };

    await storage.saveChild({ familyId: fam.id, childId: kid.id });
    await loadFamilyData(fam.id);
    setActiveChildId(kid.id);
    setMode('child');
    return {};
  };

  const logout = async () => {
    if (mode === 'parent') {
      await supabase.auth.signOut();
    } else {
      await storage.clearChild();
    }
    resetState();
  };

  // ── Data mutations ────────────────────────────────────────────────────────

  const addTask = async (task: Task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        family_id: family.id,
        child_id: task.child_id ?? null,
        title: task.title,
        description: task.description ?? null,
        icon: task.icon,
        color: task.color,
        stars: task.stars,
        due: task.due,
        status: 'pending',
      })
      .select('*')
      .single();
    if (error) throw error;
    if (data) setTasks(prev => [data, ...prev]);
  };

  const approveTask = async (id: string) => {
    await supabase.from('tasks').update({ status: 'done' }).eq('id', id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'done' } : t));
  };

  const completeChildTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !child.id) return;

    await supabase.from('tasks').update({ status: 'review' }).eq('id', id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'review' } : t));

    const newStars = child.stars + task.stars;
    await supabase.from('children').update({ stars: newStars }).eq('id', child.id);
    setChildrenList(prev => prev.map(c => c.id === child.id ? { ...c, stars: newStars } : c));
    setCelebration({ stars: task.stars });
  };

  const addReward = async (reward: Reward) => {
    const { data } = await supabase
      .from('rewards')
      .insert({
        family_id: family.id,
        title: reward.title,
        icon: reward.icon,
        color: reward.color,
        cost: reward.cost,
      })
      .select('*')
      .single();
    if (data) setRewards(prev => [data, ...prev]);
  };

  const deleteReward = async (id: string) => {
    await supabase.from('rewards').delete().eq('id', id);
    setRewards(prev => prev.filter(r => r.id !== id));
  };

  const claimPrize = async (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward || !child.id || child.stars < reward.cost) return;
    const newStars = child.stars - reward.cost;
    await supabase.from('children').update({ stars: newStars }).eq('id', child.id);
    setChildrenList(prev => prev.map(c => c.id === child.id ? { ...c, stars: newStars } : c));
    setCelebration({ stars: -reward.cost, prize: reward.title });
  };

  const addChild = async (c: Child) => {
    const { data } = await supabase
      .from('children')
      .insert({ family_id: family.id, name: c.name, avatar: c.avatar, stars: 0, streak: 0 })
      .select('*')
      .single();
    if (data) setChildrenList(prev => [...prev, data]);
  };

  // Kept for compatibility — prefer loginAsChild / registerParent
  const setFamily = (f: Family) => setFamilyState(f);
  const setChild = (c: Child) => {
    setChildrenList(prev => {
      const exists = prev.some(p => p.id === c.id);
      return exists ? prev.map(p => p.id === c.id ? c : p) : [...prev, c];
    });
    setActiveChildId(c.id);
  };

  return (
    <AppContext.Provider value={{
      loading, mode, parentEmail,
      family, children: childrenList, child, tasks, rewards, celebration, showLock,
      registerParent, loginParent, verifyParentPassword, loginAsChild, logout,
      setFamily, setChild, addChild, setCelebration, setShowLock,
      addTask, approveTask, completeChildTask, addReward, deleteReward, claimPrize,
    }}>
      {reactChildren}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
