import pool from "@api/config/db.js"

export class ChannelRepositories {
    //now this binds specificly to telegram. if new Channles table to-be created, this repository should
    //update that table instead of users and have no idea about diff types of channels.
    async bindChannelAccount(userUuid: string, channelAccountId: number): Promise<number | undefined> {
        const queryText: string = `
        WITH deleted_token AS (
            DELETE FROM Channel_Tokens
            WHERE uuid = $2 AND expires_at > NOW()
            RETURNING user_id
        )
        UPDATE Users
        SET telegram_account_id = $1
        WHERE id = (SELECT user_id FROM deleted_token)
        RETURNING id;`

        const result = await pool.query(queryText, [channelAccountId, userUuid])
        const userId: number | undefined = result.rows[0]?.id;

        return userId;
    }

    async createChannelToken(userId: number, channelName: string): Promise<string> {
        const queryText: string = `
        INSERT INTO Channel_Tokens (user_id, channel)
        VALUES ($1, $2)
        RETURNING uuid`

        const result = await pool.query(queryText, [userId, channelName]);
        const userUuid: string = result.rows[0].uuid;
        return userUuid;
    }

    async clearChanellTokens(): Promise<void> {
        const queryText: string = `
        DELETE FROM Channel_Tokens
        WHERE expires_at < NOW()`;

        await pool.query(queryText);
    }

    //now this binds specificly to telegram. if new Channles table to-be created, this repository should
    //update that table instead of users and have no idea about diff types of channels.
    //that is why channelName unused here.
    async disconnectChannelAccount(userId: number, channelName: string): Promise<void> {
        const queryText: string = `
        UPDATE Users
        SET telegram_account_id = NULL
        WHERE id = $1`

        await pool.query(queryText, [userId])
    }
}
