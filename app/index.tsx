import { Redirect } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function Index() {
  const { mode, loading } = useApp();
  if (loading) return null;
  if (mode === 'parent') return <Redirect href="/(parent)/tasks" />;
  if (mode === 'child') return <Redirect href="/(child)/tasks" />;
  return <Redirect href="/welcome" />;
}
