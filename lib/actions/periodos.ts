"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreatePeriodParams {
    startDate: string;
    endDate: string;
    paymentDate: string;
    type: "semanal" | "quincenal" | "catorcenal" | "custom";
}

export async function createPeriod(params: CreatePeriodParams) {
    try {
        const start = new Date(params.startDate);
        const end = new Date(params.endDate);
        const payment = new Date(params.paymentDate);
        const year = start.getFullYear();

        // Calculate duration in days (inclusive)
        // Adding 1 day because date difference is end - start, but we want inclusive count
        // diffTime is milliseconds
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Count existing periods for this year to generate clave
        const existingPeriodsCount = await prisma.periodo.count({
            where: {
                anio: year
            }
        });

        const nextSequence = existingPeriodsCount + 1;
        // Format: ANIO-SEQUENCE+000
        // Example: 2025-1000, 2025-2000
        const clave = `${year}-${nextSequence}000`;

        // Map frontend type to Prisma enum
        let tipoPeriodo: "SEMANAL" | "QUINCENAL" | "CATORCENAL" | "ESPECIAL";
        switch (params.type) {
            case "semanal":
                tipoPeriodo = "SEMANAL";
                break;
            case "quincenal":
                tipoPeriodo = "QUINCENAL";
                break;
            case "catorcenal":
                tipoPeriodo = "CATORCENAL";
                break;
            default:
                tipoPeriodo = "ESPECIAL";
        }

        const period = await prisma.periodo.create({
            data: {
                clave,
                fechaInicio: start,
                fechaFin: end,
                fechaPago: payment,
                totalDias: totalDays,
                anio: year,
                tipoPeriodo
            }
        });

        revalidatePath("/nomina");
        revalidatePath("/features/periodos");

        return { success: true, data: period };

    } catch (error) {
        console.error("Error creating period:", error);
        return { success: false, error: "Failed to create period" };
    }
}

export async function hasActivePeriod() {
    try {
        console.log("Checking for active periods...");
        const count = await prisma.periodo.count({
            where: {
                activo: true
            }
        });
        console.log(`Found active periods count: ${count}`);
        return { active: count > 0, count, error: null };
    } catch (error) {
        console.error("Error checking active period:", error);
        return { active: false, count: -1, error: String(error) };
    }
}
