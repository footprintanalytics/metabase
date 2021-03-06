import React from "react";
import { jt } from "ttag";
import { TYPE, isa, isFK, isPK } from "metabase/lib/types";
import { singularize, pluralize, stripId } from "metabase/lib/formatting";
import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";

import type {
  ClickAction,
  ClickActionProps,
} from "metabase-types/types/Visualization";

function getFiltersForColumn(column) {
  if (
    isa(column.base_type, TYPE.Number) ||
    isa(column.base_type, TYPE.Temporal) ||
    // change to semantic_type or ideally effective_type if that is known after merging into master
    isa(column.special_type, TYPE.Temporal)
  ) {
    return [
      { name: "<", operator: "<" },
      { name: ">", operator: ">" },
      { name: "=", operator: "=" },
      { name: "≠", operator: "!=" },
    ];
  } else {
    return [
      { name: "=", operator: "=" },
      { name: "≠", operator: "!=" },
    ];
  }
}

export default function QuickFilterDrill({
  question,
  clicked,
}: ClickActionProps): ClickAction[] {
  const query = question.query();
  if (
    !(query instanceof StructuredQuery) ||
    !clicked ||
    !clicked.column ||
    clicked.column.id == null ||
    clicked.value === undefined
  ) {
    return [];
  }

  const { value, column } = clicked;

  if (isPK(column.semantic_type)) {
    return [];
  }
  if (isFK(column.semantic_type)) {
    return [
      {
        name: "view-fks",
        section: "standalone_filter",
        buttonType: "horizontal",
        icon: "filter",
        title: (
          <span>
            {jt`View this ${singularize(
              stripId(column.display_name),
            )}'s ${pluralize(query.table().display_name)}`}
          </span>
        ),
        question: () => question.filter("=", column, value),
      },
    ];
  }

  const operators = getFiltersForColumn(column) || [];
  return operators.map(({ name, operator }) => ({
    name: operator,
    section: "filter",
    buttonType: "token-filter",
    title: <span className="h2">{name}</span>,
    question: () => question.filter(operator, column, value),
  }));
}
