-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "frecuencia" TEXT NOT NULL DEFAULT 'diario',
    "color" TEXT,
    "icono" TEXT,
    "objetivo" INTEGER NOT NULL DEFAULT 30,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habitos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,
    "habitoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "habitos_usuarioId_idx" ON "habitos"("usuarioId");

-- CreateIndex
CREATE INDEX "registros_habitoId_idx" ON "registros"("habitoId");

-- CreateIndex
CREATE INDEX "registros_fecha_idx" ON "registros"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "registros_habitoId_fecha_key" ON "registros"("habitoId", "fecha");

-- AddForeignKey
ALTER TABLE "habitos" ADD CONSTRAINT "habitos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros" ADD CONSTRAINT "registros_habitoId_fkey" FOREIGN KEY ("habitoId") REFERENCES "habitos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
