import { useEffect, useRef, useCallback } from 'react';

const AUTOSAVE_DELAY = 30000; // 30 seconds
const STORAGE_KEY = 'velusfashtown_product_draft';

export function useAutoSave(formValues, isDirty, isEditMode) {
  const timerRef = useRef(null);
  const lastSavedRef = useRef(null);

  const saveDraft = useCallback(() => {
    if (!isDirty || isEditMode) return;
    try {
      const draftData = {
        ...formValues,
        _savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
      lastSavedRef.current = Date.now();
    } catch (e) {
      // Silently fail - localStorage might be full
    }
  }, [formValues, isDirty, isEditMode]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (isDirty && !isEditMode) {
      timerRef.current = setInterval(saveDraft, AUTOSAVE_DELAY);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isDirty, isEditMode, saveDraft]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Silently fail
    }
  }, []);

  const getDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY);
      if (draft) {
        return JSON.parse(draft);
      }
    } catch (e) {
      // Silently fail
    }
    return null;
  }, []);

  return {
    saveDraft,
    clearDraft,
    getDraft,
    lastSaved: lastSavedRef.current,
  };
}

