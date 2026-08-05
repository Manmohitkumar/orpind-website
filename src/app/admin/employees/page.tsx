'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Shield, Mail, Clock, MoreVertical, UserCheck } from 'lucide-react';

type EmployeeRole = 'Admin' | 'Warehouse' | 'Support' | 'Marketing';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  status: 'active' | 'inactive';
  lastActive: string;
  avatar: string;
  joinDate: string;
}

const initialEmployees: Employee[] = [
  { id: '1', name: 'Harpreet Singh', email: 'harpreet@orpind.com', role: 'Admin', status: 'active', lastActive: '2 min ago', avatar: 'HS', joinDate: '2023-01-15' },
  { id: '2', name: 'Manpreet Kaur', email: 'manpreet@orpind.com', role: 'Admin', status: 'active', lastActive: '15 min ago', avatar: 'MK', joinDate: '2023-02-20' },
  { id: '3', name: 'Amritpal Singh', email: 'amritpal@orpind.com', role: 'Warehouse', status: 'active', lastActive: '1 hour ago', avatar: 'AS', joinDate: '2023-03-10' },
  { id: '4', name: 'Gurpreet Kaur', email: 'gurpreet@orpind.com', role: 'Support', status: 'active', lastActive: '30 min ago', avatar: 'GK', joinDate: '2023-04-05' },
  { id: '5', name: 'Rajveer Singh', email: 'rajveer@orpind.com', role: 'Marketing', status: 'active', lastActive: '3 hours ago', avatar: 'RS', joinDate: '2023-06-12' },
  { id: '6', name: 'Navneet Kaur', email: 'navneet@orpind.com', role: 'Warehouse', status: 'inactive', lastActive: '2 weeks ago', avatar: 'NK', joinDate: '2023-05-08' },
  { id: '7', name: 'Sukhchain Singh', email: 'sukhchain@orpind.com', role: 'Support', status: 'active', lastActive: '45 min ago', avatar: 'SS', joinDate: '2023-07-20' },
  { id: '8', name: 'Preeti Sharma', email: 'preeti@orpind.com', role: 'Marketing', status: 'active', lastActive: '1 day ago', avatar: 'PS', joinDate: '2023-08-01' },
];

const roleColors: Record<EmployeeRole, string> = {
  Admin: 'bg-red-100 text-red-700',
  Warehouse: 'bg-blue-100 text-blue-700',
  Support: 'bg-green-100 text-green-700',
  Marketing: 'bg-purple-100 text-purple-700',
};

export default function AdminEmployeesPage() {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const filtered = employees.filter(e => {
    if (roleFilter !== 'all' && e.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRoleChange = (id: string, newRole: EmployeeRole) => {
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Employees</h1>
          <p className="text-sm text-neutral-500">{employees.length} team members &middot; {employees.filter(e => e.status === 'active').length} active</p>
        </div>
        <button className="btn-primary text-sm py-2"><Plus className="w-4 h-4 mr-1" /> Invite Employee</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['Admin', 'Warehouse', 'Support', 'Marketing'] as const).map(role => (
          <div key={role} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className={`text-lg font-bold ${roleColors[role].split(' ')[1]}`}>{employees.filter(e => e.role === role).length}</p>
            <p className="text-xs text-neutral-500">{role}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or role..." className="input-field pl-10 text-sm" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field text-sm w-auto">
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Support">Support</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Last Active</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gold-100 rounded-full flex items-center justify-center text-sm font-bold text-gold-700">{emp.avatar}</div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{emp.name}</p>
                        <p className="text-xs text-neutral-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingRole === emp.id ? (
                      <select autoFocus onChange={e => handleRoleChange(emp.id, e.target.value as EmployeeRole)} onBlur={() => setEditingRole(null)} className="text-xs px-2 py-1 border border-neutral-200 rounded-sm bg-white">
                        {(['Admin', 'Warehouse', 'Support', 'Marketing'] as const).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <button onClick={() => setEditingRole(emp.id)} className={`text-[10px] font-semibold px-2 py-1 rounded-sm uppercase cursor-pointer hover:opacity-80 transition-opacity ${roleColors[emp.role]}`} title="Click to change role">
                        {emp.role}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium flex items-center gap-1 ${emp.status === 'active' ? 'text-green-600' : 'text-neutral-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-green-500' : 'bg-neutral-300'}`}></span>
                      {emp.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {emp.lastActive}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-600">{emp.joinDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-400">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
