import Dimension from "metabase-lib/lib/Dimension";

import type Field from "metabase-lib/lib/metadata/Field";

type Option = {
  dimension: Dimension,
};

type Section = {
  name: string,
  icon: string,
  items: Option[],
};

export default class DimensionOptions {
  count: number = 0;
  dimensions: Dimension[] = [];
  fks: Array<{
    field: Field,
    dimensions: Dimension[],
  }> = [];

  constructor(o) {
    Object.assign(this, o);
  }

  all(): Dimension {
    return [].concat(this.dimensions, ...this.fks.map(fk => fk.dimensions));
  }

  hasDimension(dimension: Dimension): boolean {
    if (!dimension) {
      console.error(
        "attempted to call FieldDimension.hasDimension() with null dimension",
        dimension,
      );
      return false;
    }

    for (const d of this.all()) {
      if (dimension.isSameBaseDimension(d)) {
        return true;
      }
    }
    return false;
  }

  sections({ extraItems = [] } = {}): Section[] {
    const table = this.dimensions[0] && this.dimensions[0].field().table;
    const tableName = table && table.objectName();
    const defaultIcon =
      table && table.isSavedQuestion() ? "search_chart" : "table2";
    const mainSection = {
      name: this.name || tableName,
      icon: this.icon || defaultIcon,
      items: [
        ...extraItems,
        ...this.dimensions.map(dimension => ({ dimension })),
      ],
    };

    const fkSections = this.fks.map(fk => ({
      name: fk.name || (fk.field && fk.field.targetObjectName()),
      icon: fk.icon || "connections",
      items: fk.dimensions.map(dimension => ({ dimension })),
    }));

    const sections = [];
    if (mainSection.items.length > 0) {
      sections.push(mainSection);
    }
    sections.push(...fkSections);

    return sections;
  }
}
