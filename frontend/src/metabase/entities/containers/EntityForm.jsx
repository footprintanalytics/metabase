/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";

import Form from "metabase/containers/Form";
import ModalContent from "metabase/components/ModalContent";

import entityType from "./EntityType";

import type { Entity } from "metabase/lib/entities";
import { getPersonalCollectionId } from "metabase/lib/collection";

export function getForm(entityDef: Entity) {
  // 1. default `form`
  // 2. first of the named `forms`
  return entityDef.form || Object.values(entityDef.forms)[0];
}

@entityType()
export default class EntityForm extends React.Component {
  render() {
    const {
      entityDef,
      entityObject,
      form = getForm(entityDef),
      update,
      create,
      onBeforeSubmit,
      user,
      // defaults to `create` or `update` (if an id is present)
      onSubmit = async object => {
        if (onBeforeSubmit) {
          const next = await onBeforeSubmit();
          if (!next) {
            throw { data: "" };
          }
        }
        const publicAnalyticPermission =
          user && user.publicAnalytic === "write";
        if (user && !publicAnalyticPermission) {
          object.collection_id = getPersonalCollectionId(user);
        }
        object.create_method = "self";
        return object.id != null ? update(object) : create(object);
      },
      onClose,
      onSaved,
      modal,
      title,
      ...props
    } = this.props;
    const eForm = (
      <Form
        {...props}
        form={form}
        initialValues={entityObject}
        onSubmit={onSubmit}
        onSubmitSuccess={action => onSaved && onSaved(action.payload.object)}
      />
    );
    if (modal) {
      return (
        <ModalContent
          title={
            title ||
            (entityObject && entityObject.id != null
              ? entityDef.objectSelectors.getName(entityObject)
              : t`New ${entityDef.displayNameOne}`)
          }
          onClose={onClose}
        >
          {eForm}
        </ModalContent>
      );
    } else {
      return eForm;
    }
  }
}
