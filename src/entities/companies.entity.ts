import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommunitiesEntity } from "./communities.entity";

@Entity("companies", { schema: "services_dbqa" })
export class CompaniesEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "company_name", length: 80 })
  companyName: string;

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
    (communitiesEntity) => communitiesEntity.company
  )
  communities: CommunitiesEntity[];
}
