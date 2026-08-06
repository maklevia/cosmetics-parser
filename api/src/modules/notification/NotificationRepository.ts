import { AppDataSource } from "@api/config/data-source.js";
import { User } from "@api/modules/user/User.js";
import { Product } from "@api/modules/product/Product.js";
import { StoreRecord } from "@api/modules/product/StoreRecord.js";
import { PriceDropQueue, PriceDropQueueStatus } from "@api/modules/notification/PriceDropQueue.js";
import { UserNotification } from "@api/modules/notification/UserNotification.js";
import { In, LessThan } from "typeorm";
import { PendingNotifData } from "@api/types/NotificationTypes.js";

export class NotificationRepository {
  private queueRepo = AppDataSource.getRepository(PriceDropQueue);
  private notifRepo = AppDataSource.getRepository(UserNotification);
  private userRepo = AppDataSource.getRepository(User);

  async createPriceDropQueue(
    storeRecordId: number,
    productId: number,
    oldPrice: number,
    newPrice: number,
  ): Promise<void> {
    const queue = new PriceDropQueue();
    queue.storeRecord = { id: storeRecordId } as StoreRecord;
    queue.product = { id: productId } as Product;
    queue.oldPrice = oldPrice;
    queue.newPrice = newPrice;

    await this.queueRepo.insert(queue);
  }

  async updatePriceDropQueue(price_drop_queue_ids: number[]): Promise<void> {
    await this.queueRepo.update(
      { id: In(price_drop_queue_ids) },
      { status: PriceDropQueueStatus.PROCESSED },
    );
  }

  async getPendingNotificationsData(): Promise<PendingNotifData[]> {
    return await this.userRepo
      .createQueryBuilder("user")
      .select('user.id', 'userId')
      .addSelect('user.telegramAccountId', 'telegramAccountId')
      .addSelect(`
        json_agg(
            json_build_object(
                'queueId', queue.id,
                'productName', storeRecord.product_store_name,
                'productId', storeRecord.product_id,
                'storeName', storeRecord.store_name,
                'productLink', storeRecord.link,
                'image', storeRecord.image,
                'oldPrice', queue.old_price,
                'newPrice', queue.new_price
            )
        )`, 'priceDropsData')
      .innerJoin('user.collections', 'collection')
      .innerJoin(PriceDropQueue, 'queue', 'queue.product_id = collection.product_id')
      .innerJoin('queue.storeRecord', 'storeRecord')
      .where('queue.status = :status', { status: PriceDropQueueStatus.PENDING })
      .andWhere('collection.notifyOnPriceDrop = :notify', { notify: true })
      .groupBy('user.id')
      .addGroupBy('user.telegramAccountId')
      .getRawMany<PendingNotifData>();
  }

  async createUserNotification(
    userId: number,
    title: string,
    message: string,
    productId?: number,
    image?: string,
  ): Promise<void> {
    const notif = new UserNotification();
    notif.user = { id: userId } as User;
    if (productId) notif.product = { id: productId } as Product;
    notif.title = title;
    notif.message = message;
    notif.image = image ?? null;

    await this.notifRepo.save(notif);
  }

  async clearOldRecords(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.queueRepo.delete({
      status: PriceDropQueueStatus.PROCESSED,
      createdAt: LessThan(sevenDaysAgo),
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await this.notifRepo.delete({
      createdAt: LessThan(thirtyDaysAgo),
    });
  }

  async getNotificationsByUserId(userId: number): Promise<UserNotification[]> {
    return await this.notifRepo.find({
      where: { user: { id: userId } },
      relations: { product: true },
    });
  }

  async assignBatchId(queueIds: number[], batchId: string): Promise<void> {
    await this.queueRepo.update({ id: In(queueIds) }, { batchId });
  }

  async getDropsByBatchId(batchId: string): Promise<any[]> {
    return await this.queueRepo
      .createQueryBuilder("queue")
      .select([
        'storeRecord.product_store_name AS "name"',
        'storeRecord.store_name AS "storeName"',
        'storeRecord.link AS "link"',
        'storeRecord.image AS "image"',
        'queue.old_price AS "oldPrice"',
        'queue.new_price AS "newPrice"'
      ])
      .innerJoin('queue.storeRecord', 'storeRecord')
      .where('queue.batch_id = :batchId', { batchId })
      .andWhere('queue.status = :status', { status: PriceDropQueueStatus.PROCESSED })
      .orderBy('queue.id', 'ASC')
      .getRawMany();
  }

  async markNotifAsRead(notifId: number): Promise<void> {
    await this.notifRepo.update(notifId, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notifRepo.update({ user: { id: userId }, isRead: false }, { isRead: true });
  }
}
