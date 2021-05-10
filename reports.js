import levelup from "levelup";
import leveldown from "leveldown";

export function createReportStore() {
  const database = leveldown("./store");
  return levelup(database);
}
