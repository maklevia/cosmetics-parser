import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "@api/entities/User.js";
import { Product } from "@api/entities/Product.js";

@Entity("User_Notifications")
export class UserNotification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.notifications, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Product, product => product.notifications, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "product_id" })
    product: Product | null;

    @Column({ type: "text", nullable: true })
    title: string | null;

    @Column({ type: "text" })
    message: string;

    @Column({ type: "text", nullable: true })
    image: string | null;

    @Column({ name: "is_read", type: "boolean", default: false })
    isRead: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;
}
