import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommunitiesEntity } from "./communities.entity";
import { ServicesEntity } from "./services.entity";
import { RolesEntity } from "./roles.entity";

@Index("role_id", ["roleId"], {})
@Entity("users", { schema: "services_dbqa" })
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @Column("varchar", { name: "email", length: 75 })
  email: string;

  @Column("varchar", { name: "phone_number", nullable: true, length: 25 })
  phoneNumber: string | null;

  @Column("bigint", { name: "role_id", unsigned: true })
  roleId: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

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
    () => CommunitiesEntity,
    (communitiesEntity) => communitiesEntity.user
  )
  communities: CommunitiesEntity[];

  @OneToMany(() => ServicesEntity, (servicesEntity) => servicesEntity.user)
  services: ServicesEntity[];

  @ManyToOne(() => RolesEntity, (rolesEntity) => rolesEntity.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: RolesEntity;
}
