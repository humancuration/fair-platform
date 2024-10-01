import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { IUser } from "./User";

@Entity("user_rewards")
export class UserReward {
  @PrimaryColumn()
  user_id: number;

  @Column({ default: 0 })
  total_points: number;

  @Column("simple-array")
  rewards_earned: number[];

  @ManyToOne(() => IUser)
  @JoinColumn({ name: "user_id" })
  user: IUser;
}