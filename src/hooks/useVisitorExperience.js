import { useSyncExternalStore } from 'react';
import { subscribeExperience, getExperience, updateExperience, clearExperience } from '../lib/visitorExperienceStore.mjs';
export default function useVisitorExperience() {
  const profile=useSyncExternalStore(subscribeExperience,getExperience,getExperience);
  return {profile,updateProfile:updateExperience,resetProfile:clearExperience};
}
