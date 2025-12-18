// src/features/lineage/hooks/index.ts

// Option A: If your hooks use named exports (export const useHook = ...)
export * from './useFamilyTreeData';
export * from './usePersonCardActions';

// Option B: If your hooks use default exports (export default function useHook...)
export { default as useFamilyTreeData } from './useFamilyTreeData';
export { default as usePersonCardActions } from './usePersonCardActions';
