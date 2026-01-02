import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TAB_SLUGS: Record<string, string> = {
  tree: 'Family Tree',
  d3tree: 'Family Tree D3',
  directory: 'Member Directory',
  unlinked: 'Unlinked Members',
};

const SLUG_TABS: Record<string, string> = {
  'Family Tree': 'tree',
  'Family Tree D3': 'd3tree',
  'Member Directory': 'directory',
  'Unlinked Members': 'unlinked',
};

export function useFamilyTreeRouting(defaultTabKey: string) {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTabKey = tab ? TAB_SLUGS[tab] || defaultTabKey : defaultTabKey;

  // Redirect to default tab if no tab is present in URL
  useEffect(() => {
    if (!tab) {
      const defaultSlug = SLUG_TABS[defaultTabKey];
      navigate(`/family-tree/${defaultSlug}`, { replace: true });
    }
  }, [tab, navigate, defaultTabKey]);

  const onTabChange = (tabKey: string) => {
    const slug = SLUG_TABS[tabKey];
    navigate(`/family-tree/${slug}`);
  };

  return { activeTabKey, onTabChange };
}
