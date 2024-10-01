import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user_activities")
export class UserActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  activity_type: string;

  @Column()
  timestamp: Date;
}