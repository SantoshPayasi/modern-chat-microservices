import { createLogger } from "@chat-app/common";
import type { Logger } from "@chat-app/common";

export const logger: Logger = createLogger({ name: "gateway-service" }); 