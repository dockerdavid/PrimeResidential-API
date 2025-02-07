import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RolesEntity } from "./roles.entity";

@Index("name", ["name"], { unique: true })
@Entity("permissions", { schema: "services_dbqa" })
export class PermissionsEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", unique: true, length: 25 })
  name: string;

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

  @ManyToMany(() => RolesEntity, (rolesEntity) => rolesEntity.permissions)
  @JoinTable({
    name: "permissions_by_role",
    joinColumns: [{ name: "permission_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "role_id", referencedColumnName: "id" }],
    schema: "services_dbqa",
  })
  roles: RolesEntity[];
}
