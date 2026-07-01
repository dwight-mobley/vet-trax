
export interface Pet {
  id: string;
  name: string;
  breed?: string | null;
  species?: string | null;
  avatar_url?: string | null;
}