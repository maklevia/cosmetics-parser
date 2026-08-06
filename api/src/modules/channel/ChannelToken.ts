import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Relation } from "typeorm";
import { User } from "@api/modules/user/User.js";

import { ChannelName } from "@api/types/Enums.js";
@Entity("Channel_Tokens")
export class ChannelToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", unique: true, default: () => "gen_random_uuid()" })
    uuid: string;

    @ManyToOne(() => User, user => user.channelTokens, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: Relation<User>;

    @Column({ type: "enum", enum: ChannelName, nullable: true })
    channel: ChannelName | null;

    @Column({ name: "expires_at", type: "timestamptz", default: () => "(CURRENT_TIMESTAMP + INTERVAL '15 minutes')" })
    expiresAt: Date;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}
