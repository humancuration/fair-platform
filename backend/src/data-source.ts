import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "./models/User"
import Reward from "./models/Reward"
import { UserReward } from "./models/UserReward"
import Campaign from "./models/Campaign"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Reward, UserReward, Campaign],
    migrations: [],
    subscribers: [],
})
