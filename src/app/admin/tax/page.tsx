'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Save, FileText, MapPin, Search } from 'lucide-react';

interface GSTRate {
  id: string;
  name: string;
  cgst: number;
  sgst: number;
  igst: number;
  description: string;
}

interface StateTax {
  id: string;
  state: string;
  stateCode: string;
  gstType: 'intra' | 'inter';
  rate: number;
  enabled: boolean;
}

interface HSNMapping {
  id: string;
  hsnCode: string;
  productName: string;
  category: string;
  gstRate: number;
}

const gstRates: GSTRate[] = [
  { id: '1', name: 'Zero Rate', cgst: 0, sgst: 0, igst: 0, description: 'Essential items (unbranded grains)' },
  { id: '2', name: '5% Slab', cgst: 2.5, sgst: 2.5, igst: 5, description: 'Packaged food items, branded cereals' },
  { id: '3', name: '12% Slab', cgst: 6, sgst: 6, igst: 12, description: 'Processed food, some spices' },
  { id: '4', name: '18% Slab', cgst: 9, sgst: 9, igst: 18, description: 'Premium products, gift sets' },
];

const initialStateTax: StateTax[] = [
  { id: '1', state: 'Punjab', stateCode: '03', gstType: 'intra', rate: 5, enabled: true },
  { id: '2', state: 'Haryana', stateCode: '06', gstType: 'inter', rate: 5, enabled: true },
  { id: '3', state: 'Delhi', stateCode: '07', gstType: 'inter', rate: 5, enabled: true },
  { id: '4', state: 'Uttar Pradesh', stateCode: '09', gstType: 'inter', rate: 5, enabled: true },
  { id: '5', state: 'Maharashtra', stateCode: '27', gstType: 'inter', rate: 5, enabled: true },
  { id: '6', state: 'Karnataka', stateCode: '29', gstType: 'inter', rate: 5, enabled: true },
  { id: '7', state: 'Tamil Nadu', stateCode: '33', gstType: 'inter', rate: 5, enabled: true },
  { id: '8', state: 'Gujarat', stateCode: '24', gstType: 'inter', rate: 5, enabled: true },
  { id: '9', state: 'Rajasthan', stateCode: '08', gstType: 'inter', rate: 5, enabled: true },
  { id: '10', state: 'West Bengal', stateCode: '19', gstType: 'inter', rate: 5, enabled: true },
  { id: '11', state: 'Kerala', stateCode: '32', gstType: 'inter', rate: 5, enabled: true },
  { id: '12', state: 'Andhra Pradesh', stateCode: '37', gstType: 'inter', rate: 5, enabled: true },
];

const initialHSN: HSNMapping[] = [
  { id: '1', hsnCode: '0910', productName: 'Garam Masala (all variants)', category: 'Spice Blends', gstRate: 5 },
  { id: '2', hsnCode: '0904', productName: 'Kashmiri Red Chilli', category: 'Whole Spices', gstRate: 5 },
  { id: '3', hsnCode: '0910', productName: 'Turmeric Powder', category: 'Ground Spices', gstRate: 5 },
  { id: '4', hsnCode: '1006', productName: 'Basmati Rice', category: 'Grains', gstRate: 0 },
  { id: '5', hsnCode: '1101', productName: 'Wheat Flour (Atta)', category: 'Flours', gstRate: 0 },
  { id: '6', hsnCode: '0910', productName: 'Cumin Powder', category: 'Ground Spices', gstRate: 5 },
  { id: '7', hsnCode: '2106', productName: 'Gift Sets', category: 'Gift Sets', gstRate: 18 },
  { id: '8', hsnCode: '0909', productName: 'Fennel Seeds', category: 'Whole Spices', gstRate: 5 },
];

export default function AdminTaxPage() {
  const [rates] = useState<GSTRate[]>(gstRates);
  const [stateTaxes, setStateTaxes] = useState<StateTax[]>(initialStateTax);
  const [hsnMappings, setHsnMappings] = useState<HSNMapping[]>(initialHSN);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'rates' | 'states' | 'hsn'>('rates');
  const [saved, setSaved] = useState(false);

  const filteredStates = stateTaxes.filter(s => {
    if (search) {
      return s.state.toLowerCase().includes(search.toLowerCase()) || s.stateCode.includes(search);
    }
    return true;
  });

  const filteredHSN = hsnMappings.filter(h => {
    if (search) {
      const q = search.toLowerCase();
      return h.hsnCode.includes(q) || h.productName.toLowerCase().includes(q) || h.category.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleState = (id: string) => {
    setStateTaxes(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Tax Management</h1>
          <p className="text-sm text-neutral-500">GST rates, state-wise configuration, and HSN mapping</p>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm py-2">
          <Save className="w-4 h-4 mr-1" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'GST Slabs', value: rates.length, color: 'text-gold-600' },
          { label: 'States Configured', value: stateTaxes.filter(s => s.enabled).length, color: 'text-green-600' },
          { label: 'HSN Mappings', value: hsnMappings.length, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 overflow-hidden">
        <div className="flex border-b border-neutral-100">
          {[
            { id: 'rates' as const, label: 'GST Rates', icon: <FileText className="w-4 h-4" /> },
            { id: 'states' as const, label: 'State Configuration', icon: <MapPin className="w-4 h-4" /> },
            { id: 'hsn' as const, label: 'HSN Code Mapping', icon: <Search className="w-4 h-4" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-gold-500 text-gold-600 bg-gold-50/50' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'rates' && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-sm text-neutral-500 mb-4">Standard GST slabs applicable to products. Intra-state: CGST + SGST. Inter-state: IGST.</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Slab Name</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">CGST</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">SGST</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">IGST</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map(rate => (
                      <tr key={rate.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-neutral-800">{rate.name}</td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{rate.cgst}%</td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{rate.sgst}%</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gold-600">{rate.igst}%</td>
                        <td className="px-4 py-3 text-xs text-neutral-500">{rate.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'states' && (
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search states by name or code..." className="input-field pl-10 text-sm" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">State</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Code</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">GST Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Rate</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStates.map(state => (
                      <tr key={state.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-neutral-800">{state.state}</td>
                        <td className="px-4 py-3 text-sm text-neutral-600 font-mono">{state.stateCode}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase ${state.gstType === 'intra' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {state.gstType === 'intra' ? 'Intra-state' : 'Inter-state'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-neutral-800">{state.rate}%</td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleState(state.id)} className={`text-xs px-2 py-1 rounded-sm font-medium cursor-pointer transition-colors ${state.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                            {state.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'hsn' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by HSN code, product, or category..." className="input-field pl-10 text-sm" />
                </div>
                <button className="text-sm font-medium text-gold-600 hover:text-gold-700 flex items-center gap-1"><Plus className="w-4 h-4" /> Add HSN Mapping</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">HSN Code</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">GST Rate</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHSN.map(mapping => (
                      <tr key={mapping.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono font-semibold text-gold-600">{mapping.hsnCode}</td>
                        <td className="px-4 py-3 text-sm text-neutral-800">{mapping.productName}</td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{mapping.category}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-neutral-800">{mapping.gstRate}%</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 hover:bg-neutral-100 rounded-sm text-neutral-600" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
