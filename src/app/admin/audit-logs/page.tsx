'use client';

import { useState } from 'react';
import { Search, Download, Calendar, Filter, User, ShoppingCart, Settings, Package, MessageSquare, Shield } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'login' | 'export';
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

const initialLogs: AuditLogEntry[] = [
  { id: '1', timestamp: '2024-04-10 14:32:05', user: 'Harpreet Singh', userRole: 'Admin', action: 'Order Updated', actionType: 'update', entity: 'Order', entityId: 'ORD-1847', details: 'Status changed from Processing to Shipped', ipAddress: '192.168.1.105' },
  { id: '2', timestamp: '2024-04-10 14:28:12', user: 'Manpreet Kaur', userRole: 'Admin', action: 'Product Created', actionType: 'create', entity: 'Product', entityId: 'OP-SP-025', details: 'New product "Jeera Powder" added to catalog', ipAddress: '192.168.1.102' },
  { id: '3', timestamp: '2024-04-10 13:45:00', user: 'System', userRole: 'System', action: 'User Login', actionType: 'login', entity: 'User', entityId: 'USR-001', details: 'Successful login from Chrome on Windows', ipAddress: '10.0.0.15' },
  { id: '4', timestamp: '2024-04-10 12:15:33', user: 'Amritpal Singh', userRole: 'Warehouse', action: 'Stock Updated', actionType: 'update', entity: 'Inventory', entityId: 'INV-042', details: 'Stock level updated for Punjabi Garam Masala 250g: 150 → 120', ipAddress: '192.168.1.110' },
  { id: '5', timestamp: '2024-04-10 11:30:00', user: 'Harpreet Singh', userRole: 'Admin', action: 'Coupon Created', actionType: 'create', entity: 'Coupon', entityId: 'CUP-018', details: 'New coupon "SUMMER15" - 15% off with ₹500 min order', ipAddress: '192.168.1.105' },
  { id: '6', timestamp: '2024-04-10 10:45:22', user: 'Manpreet Kaur', userRole: 'Admin', action: 'Banner Updated', actionType: 'update', entity: 'Banner', entityId: 'BNR-003', details: 'Hero banner "Monsoon Sale" content updated', ipAddress: '192.168.1.102' },
  { id: '7', timestamp: '2024-04-10 09:20:10', user: 'System', userRole: 'System', action: 'Export Generated', actionType: 'export', entity: 'Report', entityId: 'RPT-2024-Q1', details: 'Quarterly sales report exported as CSV', ipAddress: '10.0.0.15' },
  { id: '8', timestamp: '2024-04-10 08:00:00', user: 'System', userRole: 'System', action: 'Daily Backup', actionType: 'create', entity: 'System', entityId: 'BKP-0410', details: 'Automated daily database backup completed', ipAddress: '10.0.0.1' },
  { id: '9', timestamp: '2024-04-09 17:30:45', user: 'Harpreet Singh', userRole: 'Admin', action: 'Product Deleted', actionType: 'delete', entity: 'Product', entityId: 'OP-SP-018', details: 'Product "Test Sample Spice" removed from catalog', ipAddress: '192.168.1.105' },
  { id: '10', timestamp: '2024-04-09 16:15:00', user: 'Gurpreet Kaur', userRole: 'Support', action: 'Refund Processed', actionType: 'update', entity: 'Order', entityId: 'ORD-1823', details: 'Refund of ₹449 initiated for damaged item complaint', ipAddress: '192.168.1.108' },
  { id: '11', timestamp: '2024-04-09 15:00:22', user: 'Amritpal Singh', userRole: 'Warehouse', action: 'Shipment Created', actionType: 'create', entity: 'Shipment', entityId: 'SHP-0521', details: 'Bulk shipment created for 15 orders via Delhivery', ipAddress: '192.168.1.110' },
  { id: '12', timestamp: '2024-04-09 14:10:15', user: 'Manpreet Kaur', userRole: 'Admin', action: 'Settings Updated', actionType: 'update', entity: 'Settings', entityId: 'CFG-001', details: 'Free shipping threshold changed from ₹799 to ₹999', ipAddress: '192.168.1.102' },
];

const actionTypeColors: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  login: 'bg-purple-100 text-purple-700',
  export: 'bg-yellow-100 text-yellow-700',
};

const entityIcons: Record<string, React.ReactNode> = {
  Order: <ShoppingCart className="w-3.5 h-3.5" />,
  Product: <Package className="w-3.5 h-3.5" />,
  Inventory: <Package className="w-3.5 h-3.5" />,
  Coupon: <Settings className="w-3.5 h-3.5" />,
  Banner: <Settings className="w-3.5 h-3.5" />,
  User: <User className="w-3.5 h-3.5" />,
  Shipment: <Package className="w-3.5 h-3.5" />,
  Settings: <Settings className="w-3.5 h-3.5" />,
  Report: <Download className="w-3.5 h-3.5" />,
  System: <Shield className="w-3.5 h-3.5" />,
};

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(initialLogs);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = logs.filter(log => {
    if (actionFilter !== 'all' && log.actionType !== actionFilter) return false;
    if (entityFilter !== 'all' && log.entity !== entityFilter) return false;
    if (dateFrom && log.timestamp < dateFrom) return false;
    if (dateTo && log.timestamp > dateTo + ' 23:59:59') return false;
    if (search) {
      const q = search.toLowerCase();
      return log.user.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.entity.toLowerCase().includes(q) || log.details.toLowerCase().includes(q) || log.ipAddress.includes(q);
    }
    return true;
  });

  const uniqueEntities = [...new Set(logs.map(l => l.entity))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Audit Logs</h1>
          <p className="text-sm text-neutral-500">{logs.length} log entries</p>
        </div>
        <button className="btn-primary text-sm py-2"><Download className="w-4 h-4 mr-1" /> Export CSV</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Actions Today', value: logs.filter(l => l.timestamp.startsWith('2024-04-10')).length, color: 'text-gold-600' },
          { label: 'Updates', value: logs.filter(l => l.actionType === 'update').length, color: 'text-blue-600' },
          { label: 'Creates', value: logs.filter(l => l.actionType === 'create').length, color: 'text-green-600' },
          { label: 'Deletes', value: logs.filter(l => l.actionType === 'delete').length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user, action, entity, or IP..." className="input-field pl-10 text-sm" />
            </div>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="input-field text-sm w-auto">
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="export">Export</option>
            </select>
            <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)} className="input-field text-sm w-auto">
              <option value="all">All Entities</option>
              {uniqueEntities.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span className="text-xs text-neutral-500">Date range:</span>
            </div>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field text-sm w-auto" />
            <span className="text-xs text-neutral-400">to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field text-sm w-auto" />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="text-xs text-gold-600 hover:text-gold-700 font-medium">Clear dates</button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Entity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Details</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono text-neutral-600">{log.timestamp.split(' ')[0]}</p>
                    <p className="text-[11px] font-mono text-neutral-400">{log.timestamp.split(' ')[1]}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gold-700">{log.user.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{log.user}</p>
                        <p className="text-[10px] text-neutral-400">{log.userRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase ${actionTypeColors[log.actionType]}`}>{log.actionType}</span>
                    <p className="text-xs text-neutral-600 mt-1">{log.action}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">{entityIcons[log.entity] || <Settings className="w-3.5 h-3.5" />}</span>
                      <div>
                        <p className="text-xs font-medium text-neutral-700">{log.entity}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{log.entityId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-neutral-600 max-w-[280px] truncate">{log.details}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-neutral-500">{log.ipAddress}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-400">No log entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
