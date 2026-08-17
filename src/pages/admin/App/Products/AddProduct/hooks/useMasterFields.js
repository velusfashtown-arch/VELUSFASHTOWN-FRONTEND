import { useEffect, useState } from 'react';
import { api } from '../../../../../../lib/api';
import { getToken } from '../../../../../../lib/auth';

/**
 * Admin-defined extra fields for the Add Product form (see the Masters
 * admin screen). Fetched once and rendered generically by
 * sections/DynamicFields.js — adding a field there never needs a code change.
 */
export function useMasterFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    api.adminListMasters(token, { isActive: 'true', limit: 100 })
      .then((res) => setFields(res?.data || []))
      .catch(() => setFields([]))
      .finally(() => setLoading(false));
  }, []);

  return { fields, loading };
}
