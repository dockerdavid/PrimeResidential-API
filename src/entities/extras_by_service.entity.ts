import {
  Column,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServicesEntity } from "./services.entity";
import { ExtrasEntity } from "./extras.entity";
import { ManyToOneNoAction } from "../decorators/relations.decorator";

@Index("extra_id", ["extraId"], {})
@Index("service_id", ["serviceId"], {})
@Entity("extras_by_service", { schema: "services_dbqa" })
export class ExtrasByServiceEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "service_id", unsigned: true, nullable: true })
  serviceId: string | null;

  @Column("bigint", { name: "extra_id", unsigned: true, nullable: true })
  extraId: string | null;

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

  @ManyToOneNoAction(() => ServicesEntity, (servicesEntity) => servicesEntity.extrasByServices)
  @JoinColumn([{ name: "service_id", referencedColumnName: "id" }])
  service: ServicesEntity | null;

  @ManyToOneNoAction(() => ExtrasEntity, (extrasEntity) => extrasEntity.extrasByServices)
  @JoinColumn([{ name: "extra_id", referencedColumnName: "id" }])
  extra: ExtrasEntity | null;
}
