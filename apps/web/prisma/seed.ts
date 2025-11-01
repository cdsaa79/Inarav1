import { PrismaClient } from '@prisma/client';
import technologies from '../../../docs/seeds/technologies.json' assert { type: 'json' };
import vendors from '../../../docs/seeds/vendors.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
  // Seed vendors first.
  for (const vendor of vendors as any[]) {
    await prisma.vendor.upsert({
      where: { id: vendor.id },
      update: {},
      create: vendor,
    });
  }

  // Seed technologies along with their vendor links.  Each
  // technology record may specify an array of vendor IDs under the
  // `vendors` key.  We remove that key before inserting and then
  // create the join rows.
  for (const tech of technologies as any[]) {
    const vendorIds = Array.isArray((tech as any).vendors)
      ? (tech as any).vendors
      : [];
    const { vendors: _ignored, ...techData } = tech as any;
    await prisma.technology.upsert({
      where: { id: tech.id },
      update: {},
      create: {
        ...techData,
        approved: true, // seed technologies are approved by default
        Vendors: {
          create: vendorIds.map((vid: string) => ({ vendorId: vid })),
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
