"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCuadrillas(params?: { page?: number; pageSize?: number; search?: string }) {
    try {
        const { page = 1, pageSize = 10, search = "" } = params || {};

        // If no params are passed (or just empty object), we might assuming it is for the dropdown which wants ALL active
        // BUT, the existing usage in CuadrillasPage passes params. The dropdown usage in CuadrillaOrganizerModal passes nothing.
        // Let's distinguish by checking if params is undefined.

        if (!params) {
            const cuadrillas = await prisma.cuadrilla.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' }
            });
            return { success: true, data: cuadrillas };
        }

        // Pagination Logic
        const skip = (page - 1) * pageSize;
        const where: any = {};

        if (search) {
            where.OR = [
                { nombre: { contains: search, mode: 'insensitive' } },
                { clave: { contains: search, mode: 'insensitive' } },
                { grupo: { contains: search, mode: 'insensitive' } }
            ];
        }

        // For the table, we might show inactive ones too? 
        // CuadrillasPage shows "Total Inactivos" but table seems to show all. 
        // Let's assume we return all matching search, regardless of active status generally, or maybe filter?
        // Looking at page logic: `totalActivos` `totalInactivos` suggests we fetch all.
        // So no `activo: true` constraint here unless requested.

        const [cuadrillas, total] = await prisma.$transaction([
            prisma.cuadrilla.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { id: 'desc' },
                include: {
                    _count: {
                        select: { empleados: true }
                    }
                }
            }),
            prisma.cuadrilla.count({ where })
        ]);

        const totalActivos = await prisma.cuadrilla.count({ where: { ...where, activo: true } });
        const totalInactivos = await prisma.cuadrilla.count({ where: { ...where, activo: false } });

        return {
            success: true,
            data: cuadrillas,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
                totalActivos,
                totalInactivos
            }
        };

    } catch (error) {
        console.error("Error fetching cuadrillas:", error);
        return { success: false, error: "Failed to fetch cuadrillas" };
    }
}

export async function createCuadrilla(data: { clave?: string; nombre: string; grupo?: string; actividad?: string }) {
    try {
        const cuadrilla = await prisma.cuadrilla.create({
            data: {
                clave: data.clave || `CUA-${Date.now()}`, // Fallback if empty
                nombre: data.nombre,
                grupo: data.grupo,
                actividad: data.actividad,
                activo: true
            }
        });
        revalidatePath("/cuadrillas");
        revalidatePath("/nomina");
        return { success: true, data: cuadrilla };
    } catch (error) {
        console.error("Error creating cuadrilla:", error);
        return { success: false, error: "Failed to create cuadrilla" };
    }
}

export async function updateCuadrilla(id: number, data: { clave?: string; nombre: string; grupo?: string; actividad?: string }) {
    try {
        const cuadrilla = await prisma.cuadrilla.update({
            where: { id },
            data: {
                clave: data.clave,
                nombre: data.nombre,
                grupo: data.grupo,
                actividad: data.actividad
            }
        });
        revalidatePath("/cuadrillas");
        revalidatePath("/nomina");
        return { success: true, data: cuadrilla };
    } catch (error) {
        console.error("Error updating cuadrilla:", error);
        return { success: false, error: "Failed to update cuadrilla" };
    }
}

export async function toggleCuadrilla(id: number, currentStatus: boolean) {
    try {
        await prisma.cuadrilla.update({
            where: { id },
            data: { activo: !currentStatus }
        });
        revalidatePath("/cuadrillas");
        revalidatePath("/nomina");
        return { success: true };
    } catch (error) {
        console.error("Error toggling cuadrilla:", error);
        return { success: false, error: "Failed to toggle cuadrilla" };
    }
}

export async function getEmployeesForOrganizer(cuadrillaId: number) {
    try {
        // Get employees currently in this cuadrilla
        const assignedEmployees = await prisma.empleado.findMany({
            where: {
                activo: true,
                cuadrillas: {
                    some: { id: cuadrillaId }
                }
            },
            orderBy: { nombre: 'asc' }
        });

        // Get available employees. 
        // "Available" in M-N context usually means "Not in THIS cuadrilla".
        // Or if we want strict exclusivity, "Not in ANY cuadrilla".
        // The user said "should be an array to store all teams they are in", implying M-N.
        // So "Available" likely means "Can be added to this one", so "Not already in this one".

        const availableEmployees = await prisma.empleado.findMany({
            where: {
                activo: true,
                cuadrillas: {
                    none: { id: cuadrillaId }
                }
            },
            orderBy: { nombre: 'asc' }
        });

        return {
            success: true,
            data: {
                assigned: assignedEmployees,
                available: availableEmployees
            }
        };
    } catch (error) {
        console.error("Error fetching employees for organizer:", error);
        return { success: false, error: "Failed to fetch employees" };
    }
}

export async function assignEmployeeToCuadrilla(employeeId: number, cuadrillaId: number) {
    try {
        await prisma.empleado.update({
            where: { id: employeeId },
            data: {
                cuadrillas: {
                    connect: { id: cuadrillaId }
                }
            }
        });
        revalidatePath("/nomina");
        return { success: true };
    } catch (error) {
        console.error("Error assigning employee:", error);
        return { success: false, error: "Failed to assign employee" };
    }
}

export async function removeEmployeeFromCuadrilla(employeeId: number, cuadrillaId: number) {
    try {
        await prisma.empleado.update({
            where: { id: employeeId },
            data: {
                cuadrillas: {
                    disconnect: { id: cuadrillaId }
                }
            }
        });
        revalidatePath("/nomina");
        return { success: true };
    } catch (error) {
        console.error("Error removing employee:", error);
        return { success: false, error: "Failed to remove employee" };
    }
}
