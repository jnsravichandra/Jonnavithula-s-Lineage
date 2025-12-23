import { useMemo } from "react";
import type { Member } from "../../../shared/datamodels";
import type { PersonCardActionType } from "../types";

function useRefreshedActions(
  personCardActions: PersonCardActionType,
  refreshFamilyData: () => void,
  setIsLoading: (loading: boolean) => void
) {
  return useMemo(() => {
    if (!personCardActions.handlers) return personCardActions;
    return {
      ...personCardActions,
      handlers: {
        ...personCardActions.handlers,
        onSuccess: async () => {
          setIsLoading(true);
          try {
            personCardActions.handlers.onSuccess?.();
            await refreshFamilyData();
          } finally {
            setIsLoading(false);
          }
        },
        onDelete: async (member: Member) => {
          setIsLoading(true);
          try {
            await personCardActions.handlers.onDelete(member);
            await refreshFamilyData(); // Ensure we wait for refresh to complete
          } finally {
            setIsLoading(false);
          }
        },
      },
    };
  }, [personCardActions, refreshFamilyData, setIsLoading]);
}

export default useRefreshedActions; 