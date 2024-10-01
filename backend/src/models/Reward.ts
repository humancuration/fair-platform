import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("rewards")
export class Reward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column()
  points_required: number;
}