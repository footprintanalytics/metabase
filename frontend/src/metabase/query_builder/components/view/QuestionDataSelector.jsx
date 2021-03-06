/* eslint-disable react/prop-types */
import React from "react";

import { DatabaseSchemaAndTableDataSelector } from "metabase/query_builder/components/DataSelector";

export default function QuestionDataSelector({ query, triggerElement }) {
  return (
    <DatabaseSchemaAndTableDataSelector
      containerClassName="DataPopoverContainer"
      hasTableSearch
      databaseQuery={{ saved: true }}
      selectedDatabaseId={query.databaseId()}
      selectedTableId={query.tableId()}
      setSourceTableFn={tableId =>
        query
          .setTableId(tableId)
          .setDefaultQuery()
          .update(null, { run: true })
      }
      triggerElement={triggerElement}
      isOpen
    />
  );
}
