import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServicesEntity } from "./services.entity";
import { CommunitiesEntity } from "./communities.entity";

@Index("community_id", ["communityId"], {})
@Entity("types", { schema: "services_dbqa" })
export class TypesEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "description", length: 191 })
  description: string;

  @Column("varchar", { name: "cleaning_type", length: 191 })
  cleaningType: string;

  @Column("double", { name: "price", precision: 8, scale: 2 })
  price: number;

  @Column("decimal", {
    name: "commission",
    precision: 8,
    scale: 2,
    default: () => 0,
  })
  commission: number;

  @Column("bigint", { name: "community_id", unsigned: true })
  communityId: string;

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

  @OneToMany(() => ServicesEntity, (servicesEntity) => servicesEntity.type)
  services: ServicesEntity[];

  @ManyToOne(
    () => CommunitiesEntity,
    (communitiesEntity) => communitiesEntity.types,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "community_id", referencedColumnName: "id" }])
  community: CommunitiesEntity;
}
