import { readFile, writeFile } from "fs/promises";
import { dump, load } from "js-yaml";

import { gql } from "graphql-tag";
import { printSchema } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";

async function main() {
  const schema = await readFile("schema.graphql", { encoding: "utf-8" });
  const subgraphSchema = buildSubgraphSchema({ typeDefs: gql(schema) });
  const definition = printSchema(subgraphSchema);

  const catalogInfoContent = await readFile("catalog-info.yaml", {
    encoding: "utf-8",
  });
  const catalogInfo =load(catalogInfoContent) as any;
  if (catalogInfo?.spec) {
    catalogInfo.spec.definition = definition;
    await writeFile("catalog-info.yaml", dump(catalogInfo), {
      encoding: "utf-8",
    });
  }
}

main();
