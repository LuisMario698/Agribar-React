
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const employees = await prisma.empleado.count();
    const cuadrillas = await prisma.cuadrilla.count();

    console.log('Total Employees:', employees);
    console.log('Total Cuadrillas:', cuadrillas);

    const empSample = await prisma.empleado.findFirst({
        include: { cuadrillas: true }
    });
    console.log('Sample Employee:', empSample);

    if (empSample && !empSample.cuadrillas) {
        console.error("ERROR: cuadrillas relation missing on employee object (runtime check)");
    } else {
        console.log("Runtime check passed: cuadrillas relation exists.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
