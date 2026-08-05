'use client';

import { useState } from 'react';
import { Truck, Plus, Edit, Trash2, Save, CheckCircle, XCircle, Package, Clock } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface Carrier {
  id: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  estimatedDays: string;
  codAvailable: boolean;
}

interface ShippingRate {
  id: string;
  minWeight: string;
  maxWeight: string;
  standardPrice: number;
  expressPrice: number;
}

const initialCarriers: Carrier[] = [
  { id: '1', name: 'Delhivery', enabled: true, apiKey: 'dlv_••••••••', estimatedDays: '3-5', codAvailable: true },
  { id: '2', name: 'Shiprocket', enabled: true, apiKey: 'sr_••••••••', estimatedDays: '2-4', codAvailable: true },
  { id: '3', name: 'India Post', enabled: false, apiKey: 'ind_••••••••', estimatedDays: '5-7', codAvailable: true },
];

const initialRates: ShippingRate[] = [
  { id: '1', minWeight: '0', maxWeight: '0.5', standardPrice: 49, expressPrice: 99 },
  { id: '2', minWeight: '0.5', maxWeight: '1', standardPrice: 69, expressPrice: 129 },
  { id: '3', minWeight: '1', maxWeight: '2', standardPrice: 99, expressPrice: 179 },
  { id: '4', minWeight: '2', maxWeight: '5', standardPrice: 129, expressPrice: 229 },
  { id: '5', minWeight: '5', maxWeight: '10', standardPrice: 179, expressPrice: 299 },
  { id: '6', minWeight: '10', maxWeight: '25', standardPrice: 249, expressPrice: 399 },
];

export default function AdminShippingPage() {
  const [carriers, setCarriers] = useState<Carrier[]>(initialCarriers);
  const [rates, setRates] = useState<ShippingRate[]>(initialRates);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [standardDays, setStandardDays] = useState('3-5');
  const [expressDays, setExpressDays] = useState('1-2');
  const [saved, setSaved] = useState(false);

  const toggleCarrier = (id: string) => {
    setCarriers(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const updateRate = (id: string, field: keyof ShippingRate, value: string | number) => {
    setRates(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRate = () => {
    const newRate: ShippingRate = { id: String(Date.now()), minWeight: '0', maxWeight: '0', standardPrice: 0, expressPrice: 0 };
    setRates(prev => [...prev, newRate]);
  };

  const removeRate = (id: string) => {
    setRates(prev => prev.filter(r => r.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">Shipping Settings</h1>
          <p className="text-sm text-neutral-500">Configure carriers, rates, and delivery estimates</p>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm py-2">
          <Save className="w-4 h-4 mr-1" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Carriers', value: carriers.filter(c => c.enabled).length, color: 'text-green-600' },
          { label: 'Rate Tiers', value: rates.length, color: 'text-gold-600' },
          { label: 'Free Shipping Above', value: formatPrice(freeShippingThreshold), color: 'text-green-600' },
          { label: 'Standard Delivery', value: `${standardDays} days`, color: 'text-neutral-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-sm border border-neutral-100 p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-4 h-4 text-gold-600" />
          <h2 className="text-sm font-display font-bold text-neutral-800 uppercase tracking-wide">Shipping Carriers</h2>
        </div>
        <div className="space-y-3">
          {carriers.map(carrier => (
            <div key={carrier.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-sm border border-neutral-100">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${carrier.enabled ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-400'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-neutral-800">{carrier.name}</p>
                    {carrier.enabled ? (
                      <span className="text-[10px] font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-sm">ACTIVE</span>
                    ) : (
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-200 px-1.5 py-0.5 rounded-sm">INACTIVE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-neutral-500 font-mono">{carrier.apiKey}</span>
                    <span className="text-xs text-neutral-400">&middot;</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {carrier.estimatedDays} days</span>
                    <span className="text-xs text-neutral-400">&middot;</span>
                    <span className="text-xs text-neutral-500">{carrier.codAvailable ? 'COD Available' : 'No COD'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleCarrier(carrier.id)} className={`text-xs px-3 py-1.5 rounded-sm font-medium cursor-pointer transition-colors ${carrier.enabled ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                  {carrier.enabled ? 'Disable' : 'Enable'}
                </button>
                <button className="p-1.5 hover:bg-neutral-200 rounded-sm text-neutral-600" title="Configure"><Edit className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gold-600" />
            <h2 className="text-sm font-display font-bold text-neutral-800 uppercase tracking-wide">Rate Configuration</h2>
          </div>
          <button onClick={addRate} className="text-xs font-medium text-gold-600 hover:text-gold-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Tier</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Min Weight (kg)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Max Weight (kg)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Standard Rate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Express Rate</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(rate => (
                <tr key={rate.id} className="border-b border-neutral-50">
                  <td className="px-4 py-2">
                    <input type="text" value={rate.minWeight} onChange={e => updateRate(rate.id, 'minWeight', e.target.value)} className="input-field text-sm py-1.5 w-24" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="text" value={rate.maxWeight} onChange={e => updateRate(rate.id, 'maxWeight', e.target.value)} className="input-field text-sm py-1.5 w-24" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={rate.standardPrice} onChange={e => updateRate(rate.id, 'standardPrice', Number(e.target.value))} className="input-field text-sm py-1.5 w-28" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={rate.expressPrice} onChange={e => updateRate(rate.id, 'expressPrice', Number(e.target.value))} className="input-field text-sm py-1.5 w-28" />
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeRate(rate.id)} className="p-1.5 hover:bg-red-50 rounded-sm text-red-500" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-neutral-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-4 h-4 text-gold-600" />
          <h2 className="text-sm font-display font-bold text-neutral-800 uppercase tracking-wide">Delivery Configuration</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Free Shipping Threshold (₹)</label>
            <input type="number" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(Number(e.target.value))} className="input-field text-sm" />
            <p className="text-xs text-neutral-400 mt-1">Orders above this get free standard shipping</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Standard Delivery (days)</label>
            <input type="text" value={standardDays} onChange={e => setStandardDays(e.target.value)} className="input-field text-sm" placeholder="e.g. 3-5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Express Delivery (days)</label>
            <input type="text" value={expressDays} onChange={e => setExpressDays(e.target.value)} className="input-field text-sm" placeholder="e.g. 1-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
