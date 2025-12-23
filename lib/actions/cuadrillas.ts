"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCuadrillas({
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
                    { grupo: { contains: search, mode: "insensitive" as any } },
                ],
            }
            : {};

        const [cuadrillas, total, totalActivos, totalInactivos] = await Promise.all([
            prisma.cuadrilla.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { clave: "asc" },
                include: {
                    _count: {
                        select: { empleados: true }
                    }
                }
            }),
            prisma.cuadrilla.count({ where }),
            prisma.cuadrilla.count({ where: { activo: true } }),
            prisma.cuadrilla.count({ where: { activo: false } }),
        ]);

        return {
            success: true,
            data: cuadrillas,
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
        console.error("Error fetching cuadrillas:", error);
        return { success: false, error: "Error al cargar cuadrillas" };
    }
}

export async function createCuadrilla(data: any) {
    try {
        // 0. Handle Actividad Auto-Creation
        if (data.actividad && data.actividad.trim() !== "") {
            const actividadName = data.actividad.trim();
            const existingActividad = await prisma.actividad.findFirst({
                where: { nombre: { equals: actividadName, mode: "insensitive" } }
            });

            if (!existingActividad) {
                // Create new Actividad
                await prisma.$transaction(async (tx) => {
                    const tempClave = `ACT_${Date.now()}`;
                    const created = await tx.actividad.create({
                        data: { clave: tempClave, nombre: actividadName }
                    });
                    await tx.actividad.update({
                        where: { id: created.id },
                        data: { clave: created.id.toString() }
                    });
                });
            }
        }

        // 1. If a specific clave is provided, use it.
        if (data.clave && data.clave.trim() !== "") {
            const cuadrilla = await prisma.cuadrilla.create({
                data: {
                    clave: data.clave,
                    nombre: data.nombre,
                    grupo: data.grupo || null,
                    actividad: data.actividad || null,
                },
            });
            revalidatePath("/cuadrillas");
            return { success: true, data: cuadrilla };
        }

        // AUTO-GENERATION: "Next DB ID"
        const result = await prisma.$transaction(async (tx) => {
            const tempClave = `TEMP_${Date.now()}_${Math.random()}`;
            const created = await tx.cuadrilla.create({
                data: {
                    clave: tempClave,
                    nombre: data.nombre,
                    grupo: data.grupo || null,
                    actividad: data.actividad || null,
                },
            });

            const updated = await tx.cuadrilla.update({
                where: { id: created.id },
                data: { clave: created.id.toString() }
            });

            return updated;
        });

        revalidatePath("/cuadrillas");
        return { success: true, data: result };

    } catch (error) {
        console.error("Error creating cuadrilla:", error);
        return { success: false, error: "Error al crear cuadrilla" };
    }
}

export async function updateCuadrilla(id: number, data: any) {
    try {
        // 0. Handle Actividad Auto-Creation
        if (data.actividad && data.actividad.trim() !== "") {
            const actividadName = data.actividad.trim();
            const existingActividad = await prisma.actividad.findFirst({
                where: { nombre: { equals: actividadName, mode: "insensitive" } }
            });

            if (!existingActividad) {
                await prisma.$transaction(async (tx) => {
                    const tempClave = `ACT_${Date.now()}`;
                    const created = await tx.actividad.create({
                        data: { clave: tempClave, nombre: actividadName }
                    });
                    await tx.actividad.update({
                        where: { id: created.id },
                        data: { clave: created.id.toString() }
                    });
                });
            }
        }

        const cuadrilla = await prisma.cuadrilla.update({
            where: { id },
            data: {
                clave: data.clave,
                nombre: data.nombre,
                grupo: data.grupo,
                actividad: data.actividad,
            },
        });

        revalidatePath("/cuadrillas");
        return { success: true, data: cuadrilla };
    } catch (error) {
        console.error("Error updating cuadrilla:", error);
        return { success: false, error: "Error al actualizar cuadrilla" };
    }
}

export async function toggleCuadrilla(id: number, currentStatus: boolean) {
    try {
        const cuadrilla = await prisma.cuadrilla.update({
            where: { id },
            data: { activo: !currentStatus },
        });

        revalidatePath("/cuadrillas");
        return { success: true, data: cuadrilla };
    } catch (error) {
        console.error("Error toggling cuadrilla:", error);
        return { success: false, error: "Error al cambiar estado" };
    }
}
