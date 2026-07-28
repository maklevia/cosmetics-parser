import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "@api/entities/User.js";
import { StoreRecord } from "@api/entities/StoreRecord.js";

@Entity("Store_Records_Overrides")
@Unique(["user", "storeRecord"])
export class StoreRecordOverride {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.storeRecordOverrides, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => StoreRecord, record => record.overrides, { onDelete: "CASCADE" })
    @JoinColumn({ name: "store_record_id" })
    storeRecord: StoreRecord;

    @Column({ name: "latest_price", type: "int", nullable: true })
    latestPrice: number | null;

    @Column({ name: "in_stock", type: "boolean", default: false })
    inStock: boolean;

    @Column({ type: "boolean", default: false })
    hidden: boolean;

    @Column({ name: "custom_url", type: "varchar", length: 500, nullable: true })
    customUrl: string | null;

    @CreateDateColumn({ name: "parsed_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    parsedAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz", nullable: true })
    updatedAt: Date | null;
}
