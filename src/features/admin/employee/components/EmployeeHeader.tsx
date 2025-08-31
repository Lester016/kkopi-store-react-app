import { Trash2 } from 'lucide-react';

export const EmployeeHeader = ({ onDelete }: { onDelete: () => void }) => (
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl font-bold text-gray-800">Update Employee</h2>
    <button
      type="button"
      onClick={onDelete}
      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 transition"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </button>
  </div>
);
