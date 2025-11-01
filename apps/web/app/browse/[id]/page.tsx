import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

/**
 * Technology detail page.  Shows full details for an approved
 * technology.  Visitors can view the overview, impact metrics and
 * vendor information.  If the technology is not approved, returns a
 * 404 response.
 */
export default async function TechnologyPage({ params }: PageProps) {
  const tech = await prisma.technology.findUnique({
    where: { id: params.id },
    include: {
      Vendors: { include: { Vendor: true } },
    },
  });
  if (!tech || !tech.approved) {
    return <div className="p-6">Technology not found.</div>;
  }
  return (
    <main className="min-h-screen p-6 space-y-6">
      <Link href="/browse" className="text-blue-600 underline">← Back to browse</Link>
      <h1 className="text-2xl font-bold">{tech.name}</h1>
      <p className="text-gray-700">{tech.longDesc || tech.shortDesc || 'No description available.'}</p>
      <div className="grid grid-cols-2 gap-4">
        {tech.capexMin != null && tech.capexMax != null && (
          <p><strong>CAPEX:</strong> ${tech.capexMin} – ${tech.capexMax}</p>
        )}
        {tech.opexMin != null && tech.opexMax != null && (
          <p><strong>OPEX:</strong> ${tech.opexMin} – ${tech.opexMax}</p>
        )}
        {tech.paybackYears != null && <p><strong>Payback (yrs):</strong> {tech.paybackYears}</p>}
        {tech.benefitEnergyPct != null && <p><strong>Energy saving:</strong> {(tech.benefitEnergyPct * 100).toFixed(1)}%</p>}
        {tech.benefitWaterPct != null && <p><strong>Water saving:</strong> {(tech.benefitWaterPct * 100).toFixed(1)}%</p>}
        {tech.benefitWastePct != null && <p><strong>Waste reduction:</strong> {(tech.benefitWastePct * 100).toFixed(1)}%</p>}
        {tech.benefitCo2Tpy != null && <p><strong>CO₂ reduction:</strong> {tech.benefitCo2Tpy} tpy</p>}
      </div>
      {tech.Vendors.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Vendors</h2>
          <ul className="list-disc pl-5 space-y-1">
            {tech.Vendors.map((tv) => (
              <li key={tv.vendorId}>
                <strong>{tv.Vendor.name}</strong>
                {tv.Vendor.website && (
                  <>
                    {' '}–{' '}
                    <a href={tv.Vendor.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
