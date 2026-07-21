import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import DealDialog from '@/components/deals/DealDialog';

const STAGES = [
  { key: 'lead', label: 'Lead' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [d, c] = await Promise.all([
      base44.entities.Deal.list('-updated_date', 200),
      base44.entities.Contact.list(),
    ]);
    setDeals(d);
    setContacts(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const contactName = (id) => {
    const c = contacts.find((x) => x.id === id);
    return c ? c.name : '';
  };

  const handleMove = async (deal, stage) => {
    await base44.entities.Deal.update(deal.id, { stage });
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Deal
        </Button>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            const total = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
            return (
              <div key={stage.key} className="w-72 shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="font-semibold text-sm">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">{stageDeals.length} · ${total.toLocaleString()}</span>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {stageDeals.map((d) => (
                    <Card key={d.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setEditing(d); setDialogOpen(true); }}>
                      <CardContent className="pt-4 pb-4">
                        <div className="font-medium text-sm">{d.title}</div>
                        {contactName(d.contact_id) && <div className="text-xs text-muted-foreground mt-1">{contactName(d.contact_id)}</div>}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold">${(d.value || 0).toLocaleString()}</span>
                          <select
                            value={d.stage}
                            onChange={(e) => { e.stopPropagation(); handleMove(d, e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs border rounded px-1 py-0.5 bg-background"
                          >
                            {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md">No deals</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <DealDialog open={dialogOpen} onOpenChange={setDialogOpen} deal={editing} contacts={contacts} onSaved={load} />
    </div>
  );
}