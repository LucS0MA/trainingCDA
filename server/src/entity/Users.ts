import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { Post } from "./Posts";
import { Comment } from "./Comments";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 12, unique: true })
  username: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 30, unique: true })
  email: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Post, (post) => post.users)
  post?: Post[];

  @OneToMany(() => Comment, (comment) => comment.users)
  comment?: Comment[];
}
