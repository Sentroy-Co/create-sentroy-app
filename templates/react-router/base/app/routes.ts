import { type RouteConfig } from "@react-router/dev/routes"
import { flatRoutes } from "@react-router/fs-routes"

// File-based routing — every file under app/routes/ becomes a route.
// À la carte: create-sentroy-app only emits the route files for the services
// you selected, so the route table matches your project automatically.
export default flatRoutes() satisfies RouteConfig
