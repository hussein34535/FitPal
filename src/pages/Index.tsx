import { getProfile } from '@/lib/user-store';
import { Onboarding } from '@/components/Onboarding';
import CaloriesPage from './CaloriesPage';

const Index = () => {
  const profile = getProfile();

  if (!profile) {
    // Onboarding will save profile and reload triggers from App
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

  return <CaloriesPage />;
};

export default Index;
