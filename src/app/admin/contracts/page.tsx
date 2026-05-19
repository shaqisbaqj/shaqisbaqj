import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Contracts — Admin — UrProfile' }

const statusVariant = (s: string) => {
  if (s === 'active') return 'success'
  if (s === 'prospect') return 'warning'
  return 'default'
}

export default async function AdminContractsPage() {
  const supabase = await createClient()
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <h1
        className="font-display text-4xl font-light text-[#1C1A18] mb-6"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Institutional Contracts
      </h1>

      {contracts && contracts.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0D4C0]">
                  {['Institution', 'Contact', 'Tier', 'Value', 'Status', 'Cohort', 'Produced'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id} className="border-b border-[#E0D4C0] last:border-0">
                    <td className="px-4 py-3 font-medium text-[#1C1A18]">{c.institution_name}</td>
                    <td className="px-4 py-3 text-[#1C1A18]/60">
                      <div>{c.contact_name}</div>
                      <div className="text-xs text-[#1C1A18]/40">{c.contact_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className="capitalize">{c.tier}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[#1C1A18]/70">
                      {c.value ? `$${c.value.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(c.status) as 'success' | 'warning' | 'default'} className="capitalize">
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[#1C1A18]/60">{c.cohort_size ?? '—'}</td>
                    <td className="px-4 py-3 text-[#1C1A18]/60">{c.profiles_produced ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-20 text-[#1C1A18]/40">
          <p>No contracts yet.</p>
        </div>
      )}
    </div>
  )
}
