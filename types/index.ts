export type TaskStatus = 'pending' | 'review' | 'done';

export interface Family {
  id: string;
  parent_name: string;
  code: string;
  created_at?: string;
}

export interface Child {
  id: string;
  family_id: string;
  name: string;
  avatar: string;
  stars: number;
  streak: number;
  created_at?: string;
}

export interface Task {
  id: string;
  family_id: string;
  child_id?: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  stars: number;
  due: string;
  status: TaskStatus;
  created_at?: string;
}

export interface Reward {
  id: string;
  family_id: string;
  title: string;
  icon: string;
  color: string;
  cost: number;
  created_at?: string;
}

export type AvatarId = 'fox' | 'bear' | 'cat' | 'panda' | 'frog' | 'owl';

export interface Avatar {
  id: AvatarId;
  name: string;
  color: string;
  emoji: string;
}
