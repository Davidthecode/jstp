import { RedisClientType } from "redis";
import TokenGenerator from "./utils/token-generator";
import { GenerateType, VerifyType } from "./types/index";

class Jstp {
  private redisClient: RedisClientType;
  private tokenGenerator: TokenGenerator;

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
    this.tokenGenerator = new TokenGenerator();
  }

  public async generateOTP(config: GenerateType): Promise<string> {
    const { length, format, identifier, expiresIn } = config;
    const token = this.tokenGenerator.generateToken(format, length);
    const key = `jstp_${identifier}`;

    await this.redisClient.set(key, token, { EX: expiresIn }).catch((error) => {
      throw new Error(error);
    });
    return token;
  };

  public async verifyOTP(config: VerifyType): Promise<boolean> {
    const { identifier, token } = config;
    const key = `jstp_${identifier}`;
    const storedToken = await this.redisClient.get(key);

    if (storedToken === token) {
      await this.redisClient.del(key).catch((error) => {
        throw new Error(error);
      });
      return true;
    }
    return false;
  };

  public async deleteOTP(identifier: string): Promise<void> {
    const key = `jstp_${identifier}`;
    await this.redisClient.del(key).catch((error) => {
      throw new Error(error);
    });
  };
};

export default Jstp;