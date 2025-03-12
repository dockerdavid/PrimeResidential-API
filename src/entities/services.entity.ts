import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ExtrasByServiceEntity } from "./extras_by_service.entity";
import { StatusesEntity } from "./statuses.entity";
import { CommunitiesEntity } from "./communities.entity";
import { UsersEntity } from "./users.entity";
import { TypesEntity } from "./types.entity";

@Index("community_id", ["communityId"], {})
@Index("status_id", ["statusId"], {})
@Index("type_id", ["typeId"], {})
@Index("user_id", ["userId"], {})
@Entity("services", { schema: "services_dbqa" })
export class ServicesEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("date", { name: "date" })
  date: string;

  @Column("time", { name: "schedule", nullable: true })
  schedule: string | null;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @Column("text", { name: "user_comment", nullable: true })
  userComment: string | null;

  @Column("varchar", { name: "unity_size", length: 191 })
  unitySize: string;

  @Column("varchar", { name: "unit_number", length: 191 })
  unitNumber: string;

  @Column("bigint", { name: "community_id", unsigned: true })
  communityId: string;

  @Column("bigint", { name: "type_id", unsigned: true })
  typeId: string;

  @Column("bigint", { name: "status_id", unsigned: true })
  statusId: string;

  @Column("bigint", { name: "user_id", nullable: true, unsigned: true })
  userId: string | null;

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
    (extrasByServiceEntity) => extrasByServiceEntity.service
  )
  extrasByServices: ExtrasByServiceEntity[];

  @ManyToOne(
    () => StatusesEntity,
    (statusesEntity) => statusesEntity.services,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "status_id", referencedColumnName: "id" }])
  status: StatusesEntity;

  @ManyToOne(
    () => CommunitiesEntity,
    (communitiesEntity) => communitiesEntity.services,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "community_id", referencedColumnName: "id" }])
  community: CommunitiesEntity;

  @ManyToOne(() => UsersEntity, (usersEntity) => usersEntity.services, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: UsersEntity;

  @ManyToOne(() => TypesEntity, (typesEntity) => typesEntity.services, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "type_id", referencedColumnName: "id" }])
  type: TypesEntity;
}
