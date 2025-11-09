-- CreateTable
CREATE TABLE "address" (
    "id" BIGSERIAL NOT NULL,
    "street" VARCHAR(100),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(10),
    "id_contact" BIGINT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_id_contact_fkey" FOREIGN KEY ("id_contact") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
