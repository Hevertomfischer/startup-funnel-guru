
import React from 'react';
import UserProfile from '@/components/profile/UserProfile';

const Profile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Visualize e gerencie suas informações de perfil</p>
      </div>
      
      <div className="mt-8">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
