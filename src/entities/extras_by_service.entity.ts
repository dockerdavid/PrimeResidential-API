import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServicesEntity } from "./services.entity";
import { ExtrasEntity } from "./extras.entity";

@Index("extra_id", ["extraId"], {})
@Index("service_id", ["serviceId"], {})
@Entity("extras_by_service", { schema: "services_dbqa" })
export class ExtrasByServiceEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "service_id", unsigned: true })
  serviceId: string;

  @Column("bigint", { name: "extra_id", unsigned: true })
  extraId: string;

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

  @ManyToOne(
    () => ServicesEntity,
    (servicesEntity) => servicesEntity.extrasByServices,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "service_id", referencedColumnName: "id" }])
  service: ServicesEntity;

  @ManyToOne(
    () => ExtrasEntity,
    (extrasEntity) => extrasEntity.extrasByServices,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "extra_id", referencedColumnName: "id" }])
  extra: ExtrasEntity;
}
