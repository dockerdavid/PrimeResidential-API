import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ServicesEntity } from "./services.entity";
import { OneToManyNoAction } from "../decorators/relations.decorator";

@Entity("statuses", { schema: "services_dbqa" })
export class StatusesEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "status_name", length: 15 })
  statusName: string;

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

  @OneToManyNoAction(() => ServicesEntity, (servicesEntity) => servicesEntity.status)
  services: ServicesEntity[];
}
