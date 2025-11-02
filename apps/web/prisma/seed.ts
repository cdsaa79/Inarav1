import { PrismaClient } from '@prisma/client';
// Dynamic seed script for the INARA database.
//
// Instead of relying on static JSON files, this script generates a set
// of sample vendors and technologies at seed time.  This makes it
// simple to vary the number of records without manually editing JSON.
// Vendors are created first, then each technology is assigned one or
// two vendors at random.  All seeded technologies are marked as
// approved so they appear on the public site.

const prisma = new PrismaClient();

async function main() {
  // Define seed data for vendors.  The certification and region are
  // selected randomly from predefined choices.  Adjust the arrays
  // below to add more vendor names or change certification types.
  const vendorNames = [
    'EcoPower Solutions',
    'AquaPure Co.',
    'WasteSmart',
    'GreenTransport',
    'MaterialMinds',
    'Circular Innovators',
    'SmartCity Solutions',
    'EcoWaste Recycling',
    'EnerTech',
    'WaterWorks Plus',
  ];
  const regions = [
    'United Arab Emirates',
    'Middle East',
    'Europe',
    'Asia',
    'North America',
  ];
  const certifications = ['ISO 9001', 'ISO 14001', 'LEED Gold'];
  const vendorIds: string[] = [];
  for (let i = 0; i < vendorNames.length; i++) {
    const id = `vendor-${i + 1}`;
    vendorIds.push(id);
    await prisma.vendor.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name: vendorNames[i],
        region: regions[Math.floor(Math.random() * regions.length)],
        contactEmail: `info${i + 1}@example.com`,
        website: `https://${vendorNames[i]
          .toLowerCase()
          .replace(/\s+/g, '')}.example.com`,
        certification:
          certifications[Math.floor(Math.random() * certifications.length)],
        verified: i % 3 === 0,
      },
    });
  }

  // Define categories for technologies.  The `Circular` category in the
  // PRD maps to the same category label here.
  const categories = [
    'Energy',
    'Water',
    'Waste',
    'Transport',
    'Materials',
    'Circular',
    'Smart Cities',
  ];
  const techTypes = ['Hardware', 'Software', 'Process'];
  const randomInRange = (min: number, max: number) =>
    Math.round((Math.random() * (max - min) + min) * 100) / 100;

  // Generate and insert 60 technologies.  Each technology is linked
  // to between 1 and 2 vendors selected at random from the seeded
  // vendors.  Metrics such as CAPEX, OPEX and benefits are randomly
  // generated within realistic ranges.
  for (let i = 1; i <= 60; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const idPrefix = category.split(' ')[0].toLowerCase();
    const techId = `tech-${idPrefix}-${i}`;
    const selectedVendors = vendorIds
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);
    await prisma.technology.upsert({
      where: { id: techId },
      update: {},
      create: {
        id: techId,
        name: `${category} Innovation ${i}`,
        category,
        type: techTypes[Math.floor(Math.random() * techTypes.length)],
        shortDesc: `A breakthrough ${category.toLowerCase()} solution ${i}.`,
        longDesc: `Detailed description of ${category} Innovation ${i}.`,
        capexMin: randomInRange(20000, 80000),
        capexMax: randomInRange(80000, 200000),
        opexMin: randomInRange(200, 1000),
        opexMax: randomInRange(1000, 5000),
        paybackYears: Math.round((Math.random() * 8 + 2) * 10) / 10,
        benefitEnergyPct: randomInRange(0.05, 0.5),
        benefitWaterPct: randomInRange(0.05, 0.5),
        benefitWastePct: randomInRange(0.05, 0.5),
        benefitCo2Tpy: randomInRange(1, 15),
        tags: `${category.toLowerCase().replace(/\s+/g, '')},sustainability,innovation`,
        approved: true,
        Vendors: {
          create: selectedVendors.map((vid) => ({ vendorId: vid })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
