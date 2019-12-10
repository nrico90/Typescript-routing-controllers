// src/users/entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { IsString, MinLength, IsEmail } from "class-validator";
import { Exclude } from "class-transformer";
import * as bcrypt from "bcrypt";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("text", { nullable: false })
  @IsString()
  @MinLength(2)
  firstName: string;

  @Column("text", { nullable: false })
  @IsString()
  @MinLength(2)
  lastName: string;

  @Column("text", { nullable: false })
  @IsEmail()
  email: string;

  @Column("text")
  @MinLength(3)
  city: string;

  @IsString()
  @MinLength(8)
  @Column("text", { nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10);
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }
}
