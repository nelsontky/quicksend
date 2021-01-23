import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity()
export class File {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  type: string;

  @Column({ nullable: true, default: null })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
