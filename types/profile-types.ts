export type ProfileType = {
    auth_id: string;
    email: string;
    name: string;
    contact_number?: string;
    address?: string;
    id: number;
    fcm_token: string;
  };


 export interface ProfileContextType {
    profile: ProfileType | null;
    setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
    profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  }; 