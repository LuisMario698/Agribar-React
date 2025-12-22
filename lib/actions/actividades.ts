"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getActividades({
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
                    { clave: { contains: search, mode: "insensitive" as any } },
                ],
            }
            : {};

        const [actividades, total] = await Promise.all([
            prisma.actividad.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { clave: "asc" },
            }),
            prisma.actividad.count({ where }),
        ]);

        return {
            success: true,
            data: actividades,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    } catch (error) {
        console.error("Error fetching actividades:", error);
        return { success: false, error: "Error al cargar actividades" };
    }
}

export async function createActividad(data: any) {
    try {
        // If a specific clave is provided, use it.
        if (data.clave && data.clave.trim() !== "") {
            const actividad = await prisma.actividad.create({
                data: {
                    clave: data.clave,
                    nombre: data.nombre,
                },
            });
            revalidatePath("/actividades");
            return { success: true, data: actividad };
        }

        // AUTO-GENERATION: "Next DB ID"
        // We use a transaction to creating with a temp holder, then update clave = id
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create with temporary unique placeholder
            const tempClave = `TEMP_${Date.now()}_${Math.random()}`;
            const created = await tx.actividad.create({
                data: {
                    clave: tempClave,
                    nombre: data.nombre,
                },
            });

            // 2. Update clave to match the auto-generated ID (Sequence)
            const updated = await tx.actividad.update({
                where: { id: created.id },
                data: { clave: created.id.toString() }
            });

            return updated;
        });

        revalidatePath("/actividades");
        return { success: true, data: result };

    } catch (error) {
        console.error("Error creating actividad:", error);
        return { success: false, error: "Error al crear actividad" };
    }
}

export async function updateActividad(id: number, data: any) {
    try {
        const actividad = await prisma.actividad.update({
            where: { id },
            data: {
                clave: data.clave,
                nombre: data.nombre,
            },
        });

        revalidatePath("/actividades");
        return { success: true, data: actividad };
    } catch (error) {
        console.error("Error updating actividad:", error);
        return { success: false, error: "Error al actualizar actividad" };
    }
}
