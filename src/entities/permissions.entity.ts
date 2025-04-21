import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionsByRoleEntity } from "./permissions_by_role";
import { OneToManyNoAction } from "../decorators/relations.decorator";

@Entity("permissions", { schema: "services_dbqa" })
export class PermissionsEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", unique: true, length: 141 })
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

  @OneToManyNoAction(() => PermissionsByRoleEntity, (permissionsByRole) => permissionsByRole.permission)
  permissionsByRole: PermissionsByRoleEntity[];
}
