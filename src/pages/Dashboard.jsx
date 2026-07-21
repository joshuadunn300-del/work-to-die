import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, DollarSign, Trophy } from 'lucide-react';

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, d] = await Promise.all([
        base44.entities.Contact.list(),
        base44.entities.Deal.list(),
      ]);
      setContacts(c);
      setDeals(d);
      setLoading(false);
    })();
  }, []);

  const openStages = (s) => !['won', 'lost'].includes(s);
  const pipelineValue = deals.filter((d) => openStages(d.stage)).reduce((sum, d) => sum + (d.value || 0), 0);
  const wonValue = deals.filter((d) => d.stage === 'won').reduce((sum, d) => sum + (d.value || 0), 0);

  const stats = [
    { label: 'Contacts', value: contacts.length, icon: Users },
    { label: 'Open Deals', value: deals.filter((d) => openStages(d.stage)).length, icon: Briefcase },
    { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, icon: DollarSign },
    { label: 'Won Revenue', value: `$${wonValue.toLocaleString()}`, icon: Trophy },
  ];

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No deals yet.</p>
          ) : (
            <ul className="space-y-2">
              {deals.slice(0, 8).map((d) => (
                <li key={d.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium">{d.title}</span>
                  <span className="text-sm text-muted-foreground capitalize">{d.stage} · ${(d.value || 0).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}