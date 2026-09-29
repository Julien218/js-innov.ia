import { DEFAULT_PROFILE, normalizeProfile, campaignProfile } from './webStudio.mjs';
export const CHOICES_KEY='jsinnovia:visitor-choices:v1';
export const CHOICES_TTL=30*24*60*60*1000;
/** Persistence is opt-in; never persist names, site addresses, analysis or browsing history. */
export function loadChoices(storage, now=Date.now()) {
  try {
    const record=JSON.parse(storage?.getItem(CHOICES_KEY) || 'null');
    if (!record) return null;
    if (record.version!==1 || record.consent!==true || !Number.isFinite(record.expiresAt) || record.expiresAt<=now || record.expiresAt>now+CHOICES_TTL+1000) { storage?.removeItem(CHOICES_KEY); return null; }
    return normalizeProfile({ sector:record.choices?.sector, goal:record.choices?.goal, model:record.choices?.model, accent:record.choices?.accent, remember:true });
  } catch { return null; }
}
export function persistChoices(storage, profile, now=Date.now()) {
  try {
    if (!profile.remember) { storage?.removeItem(CHOICES_KEY); return true; }
    const {sector,goal,model,accent}=normalizeProfile(profile);
    storage.setItem(CHOICES_KEY,JSON.stringify({version:1,consent:true,expiresAt:now+CHOICES_TTL,choices:{sector,goal,model,accent}}));
    return true;
  } catch { return false; }
}
const storage=()=>{ try { return globalThis.window?.localStorage; } catch { return undefined; } };
const saved=loadChoices(storage());
const campaign=campaignProfile(globalThis.window?.location?.search || '');
let state=normalizeProfile({...DEFAULT_PROFILE,...(saved || {}),...(campaign.sector?{sector:campaign.sector}:{}),...(campaign.goal?{goal:campaign.goal}:{}),...(campaign.model?{model:campaign.model}:{})});
const listeners=new Set();
export const subscribeExperience=fn=>{listeners.add(fn);return()=>listeners.delete(fn);};
export const getExperience=()=>state;
export function updateExperience(patch) {
  state=normalizeProfile({...state,...patch});
  if (!persistChoices(storage(),state) && state.remember) state={...state,remember:false};
  listeners.forEach(fn=>fn());
}
export function clearExperience() {
  state=normalizeProfile(DEFAULT_PROFILE);
  persistChoices(storage(),state);
  // Only remove our own public, allowlisted campaign keys; preserve unrelated URL parameters.
  try {
    const url=new URL(window.location.href);
    ['secteur','objectif','modele'].forEach(key=>url.searchParams.delete(key));
    window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
  } catch { /* No browser or restricted history. */ }
  listeners.forEach(fn=>fn());
}
