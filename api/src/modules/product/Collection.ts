import { Product } from "@api/modules/product/Product.js";
import { User } from "@api/modules/user/User.js";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("Collections")
    export class Collection {
        @PrimaryGeneratedColumn()
        id: number;

        @Column({name: "notify_on_price_drop", type: "boolean", default: true})
        notifyOnPriceDrop: boolean

        @CreateDateColumn({name: "created_at", type: "timestamptz"})
        createdAt: Date;

        @ManyToOne(() => User, (user) => user.collections, { onDelete: "CASCADE" })
        @JoinColumn({ name: "user_id" })
        user: User;

        @ManyToOne(() => Product, (product) => product.collections, { onDelete: "CASCADE" })
        @JoinColumn({name: "product_id"})
        product: Product;
    }
