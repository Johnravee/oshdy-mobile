import { Session } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  init: boolean;
  logout: () => Promise<void>;
}