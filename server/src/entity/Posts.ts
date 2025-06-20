import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./Users";
import { Comment } from "./Comments";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 30, unique: true })
  title: string;

  @Column({ type: "varchar", length: 150 })
  description: string;

  @Column({ type: "varchar" })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.posts)
  comment: Comment[];
}
