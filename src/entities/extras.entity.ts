import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExtrasByServiceEntity } from "./extras_by_service.entity";

@Entity("extras", { schema: "services_dbqa" })
export class ExtrasEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "item", length: 191 })
  item: string;

  @Column("double", { name: "item_price", precision: 8, scale: 2 })
  itemPrice: number;

  @Column("double", {
    name: "commission",
    precision: 8,
    scale: 2,
    default: () => "'0.00'",
  })
  commission: number;

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

  @OneToMany(
    () => ExtrasByServiceEntity,
    (extrasByServiceEntity) => extrasByServiceEntity.extra
  )
  extrasByServices: ExtrasByServiceEntity[];
}
