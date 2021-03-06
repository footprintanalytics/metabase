/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { t } from "ttag";

import { DatabaseSchemaAndTableDataSelector } from "metabase/query_builder/components/DataSelector";
import { getDatabasesList } from "metabase/query_builder/selectors";

import { NotebookCell, NotebookCellItem } from "../NotebookCell";
import {
  FieldPickerContentContainer,
  FIELDS_PICKER_STYLES,
  FieldsPickerIcon,
} from "../FieldsPickerIcon";
import FieldsPicker from "./FieldsPicker";
import { getProject } from "metabase/lib/project_info";
// import { getProject, isDefi360 } from "metabase/lib/project_info";

function DataStep({ color, query, updateQuery }) {
  const table = query.table();
  const canSelectTableColumns = table && query.isRaw();
  // const project = getProject();
  // const showSavedChart = isDefi360(project);
  // const databaseQuery = showSavedChart ? { saved: true } : {};
  const databaseQuery = { project: getProject() };
  // const databaseQuery = { saved: true };
  return (
    <NotebookCell color={color}>
      <NotebookCellItem
        color={color}
        inactive={!table}
        right={
          canSelectTableColumns && (
            <DataFieldsPicker
              query={query}
              updateQuery={updateQuery}
              triggerStyle={FIELDS_PICKER_STYLES.trigger}
              triggerElement={FieldsPickerIcon}
            />
          )
        }
        containerStyle={FIELDS_PICKER_STYLES.notebookItemContainer}
        rightContainerStyle={FIELDS_PICKER_STYLES.notebookRightItemContainer}
        data-testid="data-step-cell"
      >
        <DatabaseSchemaAndTableDataSelector
          hasTableSearch
          databaseQuery={databaseQuery}
          selectedDatabaseId={query.databaseId()}
          selectedTableId={query.tableId()}
          setSourceTableFn={(tableId, dbId) => {
            return query
              .setTableId(tableId, dbId)
              .setDefaultQuery()
              .update(updateQuery);
          }}
          isInitiallyOpen={!query.tableId()}
          triggerElement={
            <FieldPickerContentContainer>
              {table ? table.displayName() : t`Pick your starting data`}
            </FieldPickerContentContainer>
          }
        />
      </NotebookCellItem>
    </NotebookCell>
  );
}

export default connect(state => ({ databases: getDatabasesList(state) }))(
  DataStep,
);

export const DataFieldsPicker = ({ query, updateQuery, ...props }) => {
  const dimensions = query.tableDimensions();
  const selectedDimensions = query.columnDimensions();
  const selected = new Set(selectedDimensions.map(d => d.key()));
  const fields = query.fields();
  return (
    <FieldsPicker
      {...props}
      dimensions={dimensions}
      selectedDimensions={selectedDimensions}
      isAll={!fields || fields.length === 0}
      onSelectAll={() => query.clearFields().update(updateQuery)}
      onToggleDimension={(dimension, enable) => {
        setTimeout(() => {
          query
            .setFields(
              dimensions
                .filter(d => {
                  if (d === dimension) {
                    return !selected.has(d.key());
                  } else {
                    return selected.has(d.key());
                  }
                })
                .map(d => d.mbql()),
            )
            .update(updateQuery);
        }, 0);
      }}
    />
  );
};
