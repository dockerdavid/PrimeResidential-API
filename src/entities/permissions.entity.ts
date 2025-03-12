import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionsByRoleEntity } from "./permissions_by_role";

@Index("IDX_48ce552495d14eae9b187bb671", ["name"], { unique: true })
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
    default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @OneToMany(() => PermissionsByRoleEntity, (permissionsByRole) => permissionsByRole.permission)
  permissionsByRole: PermissionsByRoleEntity[];
}
