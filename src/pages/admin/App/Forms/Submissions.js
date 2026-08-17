import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { useAdminWebsite } from '../../../../context/AdminWebsiteContext';
import AdminModal from '../../Common/Modal';
import ConfirmDeleteModal from '../../Common/ConfirmDeleteModal';
import AdminTable from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';
import FormField from '../../Common/Form/FormField';
import { adminToast } from '../../Common/buttonClasses';
import NoWebsiteSelected from './NoWebsiteSelected';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'archived', label: 'Archived' },
];

function SubmissionDetailModal({ submission, formName, onClose }) {
  return (
    <AdminModal isOpen={true} onClose={onClose} title={formName || 'Submission'} size="md">
      <div className="flex flex-col gap-3">
        <p className="m-0 text-[11px] text-muted">
          Submitted {new Date(submission.createdAt).toLocaleString()}
        </p>
        <div className="overflow-hidden rounded-lg border border-line">
          {submission.data.map((entry, i) => (
            <div key={entry.key} className={`flex flex-col gap-0.5 px-3 py-2.5 ${i % 2 ? 'bg-[rgba(47,31,25,0.02)]' : ''}`}>
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">{entry.key}</span>
              <span className="break-words text-[13px] text-ink">{String(entry.value ?? '—')}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminModal>
  );
}

export default function Submissions() {
  const token = getToken();
  const { selectedWebsiteId } = useAdminWebsite();
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [viewing, setViewing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadForms = useCallback(() => {
    if (!selectedWebsiteId) return;
    api.adminListForms(token, selectedWebsiteId).then((res) => setForms(res?.data || [])).catch(() => setForms([]));
  }, [token, selectedWebsiteId]);

  useEffect(() => { loadForms(); }, [loadForms]);

  const {
    rows, loading, refreshing, pagination, error,
    refresh: loadSubmissions, goToPage, changePageSize,
  } = useTableData({
    fetcher: async (params) => {
      if (!selectedWebsiteId) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
      const res = await api.adminListSubmissions(token, selectedWebsiteId, { ...params, formId: selectedFormId || undefined });
      return res;
    },
  });

  useEffect(() => { loadSubmissions(); }, [selectedFormId, selectedWebsiteId]); // eslint-disable-line

  function formName(formId) {
    return forms.find((f) => (f.id || f._id) === formId)?.name || 'Form';
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteSubmission(token, selectedWebsiteId, toDelete.id || toDelete._id);
      await loadSubmissions();
      setToDelete(null);
      showSuccess('Submission deleted!');
    } catch (err) {
      showError(err.message || 'Failed to delete submission');
    } finally {
      setDeleting(false);
    }
  }

  async function markStatus(submission, status) {
    try {
      await api.adminUpdateSubmissionStatus(token, selectedWebsiteId, submission.id || submission._id, status);
      loadSubmissions();
    } catch (err) {
      showError(err.message || 'Failed to update submission');
    }
  }

  function showSuccess(msg) { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  function showError(msg) { setLocalError(msg); setTimeout(() => setLocalError(''), 3000); }

  if (!selectedWebsiteId) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="m-0 text-lg font-semibold text-ink">Form Submissions</h2>
          <p className="m-0 mt-1 text-[13px] text-muted">Entries visitors submitted through your forms.</p>
        </div>
        <NoWebsiteSelected what="submissions" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="m-0 text-lg font-semibold text-ink">Form Submissions</h2>
          <p className="m-0 mt-1 text-[13px] text-muted">Entries visitors submitted through your forms.</p>
        </div>
        <div className="w-full max-w-[240px]">
          <FormField
            label="Filter by form"
            type="select"
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            options={[{ value: '', label: 'All forms' }, ...forms.map((f) => ({ value: f.id || f._id, label: f.name }))]}
          />
        </div>
      </div>

      {success && <div className={`${adminToast} bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)]`}>{success}</div>}
      {(error || localError) && <div className={`${adminToast} bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)]`}>{error || localError}</div>}

      {viewing && (
        <SubmissionDetailModal submission={viewing} formName={formName(viewing.form)} onClose={() => setViewing(null)} />
      )}
      <ConfirmDeleteModal
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName="this submission"
      />

      <AdminTable
        title="Submissions"
        searchable={false}
        onRefresh={loadSubmissions}
        loading={loading}
        refreshing={refreshing}
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        columns={[
          { key: 'form', header: 'Form', render: (s) => <span className="text-[12px] text-ink">{formName(s.form)}</span> },
          {
            key: 'data',
            header: 'Preview',
            render: (s) => <span className="text-[12px] text-muted">{s.data?.slice(0, 2).map((d) => String(d.value)).join(' · ') || '—'}</span>,
          },
          { key: 'createdAt', header: 'Received', render: (s) => <span className="text-[11px] text-muted">{new Date(s.createdAt).toLocaleString()}</span> },
          {
            key: 'status',
            header: 'Status',
            render: (s) => {
              const color = s.status === 'new' ? 'text-[#137333]' : s.status === 'archived' ? 'text-muted' : 'text-ink';
              return <span className={`text-[11px] font-semibold uppercase ${color}`}>{s.status}</span>;
            },
          },
        ]}
        rows={rows}
        rowKey="id"
        rowActions={[
          { label: 'View', onClick: (s) => { setViewing(s); if (s.status === 'new') markStatus(s, 'read'); } },
          { label: 'Archive', onClick: (s) => markStatus(s, 'archived'), hidden: (s) => s.status === 'archived' },
          { label: 'Delete', danger: true, onClick: setToDelete },
        ]}
        emptyMessage="No submissions yet."
      />
    </div>
  );
}
