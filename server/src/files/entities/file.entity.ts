import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { Length } from "class-validator";

@Entity()
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Length(1)
  versionId: string;

  @Column()
  @Length(1)
  name: string;

  @Column()
  size: number;

  @Column()
  @Length(1)
  type: string;

  @Column({ nullable: true, default: null })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
