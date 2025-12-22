/*
  Warnings:

  - You are about to drop the column `apellido` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `puesto` on the `Empleado` table. All the data in the column will be lost.
  - You are about to drop the column `salario` on the `Empleado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clave]` on the table `Empleado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[curp]` on the table `Empleado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellidoPaterno` to the `Empleado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clave` to the `Empleado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `curp` to the `Empleado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaIngreso` to the `Empleado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sueldoDiario` to the `Empleado` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoPeriodo" AS ENUM ('SEMANAL', 'QUINCENAL', 'CATORCENAL', 'ESPECIAL');

-- CreateEnum
CREATE TYPE "EstadoNomina" AS ENUM ('ABIERTA', 'CERRADA');

-- DropIndex
DROP INDEX "Empleado_email_key";

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "apellido",
DROP COLUMN "creadoEn",
DROP COLUMN "email",
DROP COLUMN "fechaInicio",
DROP COLUMN "puesto",
DROP COLUMN "salario",
ADD COLUMN     "apellidoMaterno" TEXT,
ADD COLUMN     "apellidoPaterno" TEXT NOT NULL,
ADD COLUMN     "clave" TEXT NOT NULL,
ADD COLUMN     "cuadrillaId" INTEGER,
ADD COLUMN     "curp" TEXT NOT NULL,
ADD COLUMN     "descuentoInfonavit" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "enCuadrilla" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "estadoOrigen" TEXT,
ADD COLUMN     "fechaIngreso" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nss" TEXT,
ADD COLUMN     "registroPatronal" TEXT,
ADD COLUMN     "rfc" TEXT,
ADD COLUMN     "sueldoDiario" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tieneInfonavit" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Cuadrilla" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "grupo" TEXT,
    "actividad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cuadrilla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periodo" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "totalDias" INTEGER NOT NULL,
    "fechaPago" TIMESTAMP(3) NOT NULL,
    "anio" INTEGER NOT NULL,
    "tipoPeriodo" "TipoPeriodo" NOT NULL,

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nomina" (
    "id" SERIAL NOT NULL,
    "clave" TEXT,
    "periodoId" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "cuadrillaId" INTEGER,
    "pagoPorDia" DOUBLE PRECISION[],
    "campoPorDia" TEXT[],
    "actividadPorDia" TEXT[],
    "total" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL,
    "extras" DOUBLE PRECISION NOT NULL,
    "comedor" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoNomina" NOT NULL DEFAULT 'ABIERTA',
    "fechaCierre" TIMESTAMP(3),
    "usuarioCierreId" INTEGER,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreoId" INTEGER,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campo" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Campo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contacto" TEXT,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuadrilla_clave_key" ON "Cuadrilla"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_clave_key" ON "Actividad"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Periodo_clave_key" ON "Periodo"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Nomina_clave_key" ON "Nomina"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Campo_clave_key" ON "Campo"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_clave_key" ON "Usuario"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_clave_key" ON "Rol"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_clave_key" ON "Empleado"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_curp_key" ON "Empleado"("curp");

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_cuadrillaId_fkey" FOREIGN KEY ("cuadrillaId") REFERENCES "Cuadrilla"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_cuadrillaId_fkey" FOREIGN KEY ("cuadrillaId") REFERENCES "Cuadrilla"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_usuarioCreoId_fkey" FOREIGN KEY ("usuarioCreoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
