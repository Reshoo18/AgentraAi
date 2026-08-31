// import Redis from "ioredis"

// const redis =new Redis(process.env.REDIS_URL)

// redis.on("connect",()=>{
//     console.log("redis connected")
// })

// export default redis

import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("redis connected");
});

redis.on("error", (error) => {
  console.error("Redis Error:", error.message);
});

export default redis;