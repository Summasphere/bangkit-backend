CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "path" VARCHAR NOT NULL,

    CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),
    "summaryId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "hash" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),
    "userId" INTEGER,

    CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summary" (
    "id" SERIAL NOT NULL,
    "textInput" VARCHAR,
    "fileInput" VARCHAR,
    "length" INTEGER NOT NULL,
    "dataPDF" VARCHAR NOT NULL,

    CONSTRAINT "PK_406f24bdfa7fbb014243f5f8571" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR,
    "password" VARCHAR,
    "provider" VARCHAR NOT NULL DEFAULT 'email',
    "socialId" VARCHAR,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),
    "photoId" UUID,
    "roleId" INTEGER,
    "statusId" INTEGER,

    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "REL_b648d22a74c3117b9a42bdbba8" ON "history"("summaryId");

-- CreateIndex
CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_e12875dfb3b1d92d7d7c5377e22" ON "user"("email");

-- CreateIndex
CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user"("firstName");

-- CreateIndex
CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user"("socialId");

-- CreateIndex
CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user"("lastName");

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "FK_b648d22a74c3117b9a42bdbba8a" FOREIGN KEY ("summaryId") REFERENCES "summary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

