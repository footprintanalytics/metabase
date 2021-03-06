/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";

import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";

import * as Urls from "metabase/lib/urls";

import Dashboard from "metabase/entities/dashboards";

import ArchiveModal from "metabase/components/ArchiveModal";
import { isCreator } from "metabase/containers/dashboards/shared/utils";
import { getUser } from "metabase/selectors/user";
import { message } from "antd";

const mapStateToProps = state => ({
  user: getUser(state),
});

const mapDispatchToProps = {
  setDashboardArchived: Dashboard.actions.setArchived,
  push,
};

@connect(mapStateToProps, mapDispatchToProps)
@Dashboard.load({
  id: (state, props) =>
    props.id ||
    Urls.extractCollectionId(props.params.slug) ||
    props.location.query.id,
})
/*@Collection.load({
  id: (state, props) => props.dashboard && props.dashboard.collection_id,
})*/
@withRouter
export default class ArchiveDashboardModal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  close = () => {
    // since we need to redirect back to the parent collection when archiving
    // we have to call this here first to unmount the modal and then push to the
    // parent collection
    this.props.onClose();
    if (!isCreator() && this.props.dashboard.archived) {
      // this.props.push(Urls.collection(this.props.collection));
      this.props.push("/");
    }
  };

  minePage = () => {
    return window.location.pathname === "/mine";
  };

  archive = async () => {
    const hide = message.loading("Action in progress..", 0);
    const { otherSuccessAction, location, router, user } = this.props;
    const dashboardId =
      this.props.id ||
      Urls.extractEntityId(this.props.params.slug) ||
      location?.query?.id;
    await this.props.setDashboardArchived(
      { id: dashboardId, name: location?.query?.uniqueName },
      true,
    );
    otherSuccessAction && otherSuccessAction();
    setTimeout(() => router.replace(`/@${user.name}?model=dashboard`));
    hide();
  };

  render() {
    return (
      <ArchiveModal
        title={t`Delete this dashboard?`}
        message={t`Are you sure you want to do this?`}
        onClose={this.close}
        onArchive={this.archive}
      />
    );
  }
}
