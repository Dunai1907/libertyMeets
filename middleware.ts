import { stackMiddlewares } from "./middlewares/stackMiddlewares";
import { withHeaders } from "./middlewares/withHeaders";

const middlewares = [withHeaders];
export default stackMiddlewares(middlewares);
