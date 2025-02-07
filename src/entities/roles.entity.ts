import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionsEntity } from "./permissions.entity";
import { UsersEntity } from "./users.entity";

@Entity("roles", { schema: "services_dbqa" })
export class RolesEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 25 })
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

  @ManyToMany(
    () => PermissionsEntity,
    (permissionsEntity) => permissionsEntity.roles
  )
  permissions: PermissionsEntity[];

  @OneToMany(() => UsersEntity, (usersEntity) => usersEntity.role)
  users: UsersEntity[];
}
