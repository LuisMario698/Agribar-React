
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const activePeriods = await prisma.periodo.findMany({
        where: { activo: true }
    });
    console.log('Active periods in DB:', activePeriods);
    const count = await prisma.periodo.count({
        where: { activo: true }
    });
    console.log('Count:', count);
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });
