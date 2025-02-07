import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("costs", { schema: "services_dbqa" })
export class CostsEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("date", { name: "date" })
  date: string;

  @Column("varchar", { name: "description", length: 191 })
  description: string;

  @Column("decimal", { name: "amount", precision: 10, scale: 2 })
  amount: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
