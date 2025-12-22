"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEmpleados({
    page = 1,
    pageSize = 10,
    search = "",
}: {
    page?: number;
    pageSize?: number;
    search?: string;
}) {
    try {
        const skip = (page - 1) * pageSize;

        const where = search
            ? {
                OR: [
                    { nombre: { contains: search, mode: "insensitive" as any } },
                    { apellidoPaterno: { contains: search, mode: "insensitive" as any } },
                    { apellidoMaterno: { contains: search, mode: "insensitive" as any } },
                    { clave: { contains: search, mode: "insensitive" as any } },
                ],
            }
            : {};

        const [empleados, total, totalActivos, totalInactivos] = await Promise.all([
            prisma.empleado.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { clave: "asc" },
            }),
            prisma.empleado.count({ where }),
            prisma.empleado.count({ where: { activo: true } }),
            prisma.empleado.count({ where: { activo: false } }),
        ]);

        return {
            success: true,
            data: empleados,
            meta: {
                total,
                totalActivos,
                totalInactivos,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    } catch (error) {
        console.error("Error fetching empleados:", error);
        return { success: false, error: "Error al cargar empleados" };
    }
}

export async function createEmpleado(data: any) {
    try {
        // 1. If Clave IS provided, use it
        if (data.clave && data.clave.trim() !== "") {
            const empleado = await prisma.empleado.create({
                data: {
                    ...data,
                    fechaIngreso: new Date(data.fechaIngreso),
                    sueldoDiario: parseFloat(data.sueldoDiario),
                },
            });
            revalidatePath("/empleados");
            return { success: true, data: empleado };
        }

        // 2. AUTO-GENERATION: Transaction to use DB ID
        const result = await prisma.$transaction(async (tx) => {
            const tempClave = `TEMP_${Date.now()}_${Math.random()}`;

            // Create with temp clave
            const created = await tx.empleado.create({
                data: {
                    ...data,
                    clave: tempClave,
                    fechaIngreso: new Date(data.fechaIngreso),
                    sueldoDiario: parseFloat(data.sueldoDiario),
                }
            });

            // Update with ID
            const updated = await tx.empleado.update({
                where: { id: created.id },
                data: { clave: created.id.toString() }
            });

            return updated;
        });

        revalidatePath("/empleados");
        return { success: true, data: result };

    } catch (error) {
        console.error("Error creating empleado:", error);
        return { success: false, error: "Error al crear empleado" };
    }
}

export async function updateEmpleado(id: number, data: any) {
    try {
        const empleado = await prisma.empleado.update({
            where: { id },
            data: {
                ...data,
                fechaIngreso: new Date(data.fechaIngreso),
                sueldoDiario: parseFloat(data.sueldoDiario),
            },
        });

        revalidatePath("/empleados");
        return { success: true, data: empleado };
    } catch (error) {
        console.error("Error updating empleado:", error);
        return { success: false, error: "Error al actualizar empleado" };
    }
}

export async function toggleEmpleado(id: number, currentStatus: boolean) {
    try {
        const empleado = await prisma.empleado.update({
            where: { id },
            data: { activo: !currentStatus },
        });

        revalidatePath("/empleados");
        return { success: true, data: empleado };
    } catch (error) {
        console.error("Error toggling empleado:", error);
        return { success: false, error: "Error al actualizar estado" };
    }
}
