import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box } from "grid-styled";

import { t } from "ttag";
import _ from "underscore";
import { capitalize } from "metabase/lib/formatting";
// import { color, darken } from "metabase/lib/colors";
import MetabaseSettings from "metabase/lib/settings";
import * as Urls from "metabase/lib/urls";
import Modal from "metabase/components/Modal";

import LogoIcon from "metabase/components/LogoIcon";
import EntityMenu from "metabase/components/EntityMenu";
import { isDefi360 } from "metabase/lib/project_info";

// generate the proper set of list items for the current user
// based on whether they're an admin or not
export default class ProfileLink extends Component {
  state = {
    dropdownOpen: false,
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    context: PropTypes.string,
  };

  openModal = modalName => {
    this.setState({ dropdownOpen: false, modalOpen: modalName });
  };

  closeModal = () => {
    this.setState({ modalOpen: null });
  };

  generateOptionsForUser = () => {
    const { tag } = MetabaseSettings.get("version");
    const admin = this.props.user.is_superuser;
    const user = this.props.user;
    const publicAnalyticPermission = user && user.publicAnalytic === "write";
    const isAdmin = user && user.is_superuser;
    const isMarket = user && user.isMarket;
    const userName = user && user.name;
    const adminContext = this.props.context === "admin";
    if (isDefi360()) {
      return [
        {
          title: t`Account settings`,
          icon: null,
          link: Urls.accountSettings(),
          event: `Navbar;Profile Dropdown;Edit Profile`,
        },
        {
          title: t`Sign out`,
          icon: null,
          link: "auth/logout",
          event: `Navbar;Profile Dropdown;Logout`,
        },
      ];
    }
    return [
      {
        title: t`My Profile`,
        icon: null,
        link: Urls.myProfileUrl(userName),
        event: `Navbar;Profile Dropdown;My Profile`,
      },
      {
        title: t`Account settings`,
        icon: null,
        link: Urls.accountSettings(),
        event: `Navbar;Profile Dropdown;Edit Profile`,
      },
      MetabaseSettings.isHosted() &&
        admin && {
          title: t`Manage Metabase Cloud`,
          link: MetabaseSettings.storeUrl("login"),
          event: `Navbar;Profile Dropdown;ManageHosting ${tag}`,
          externalLink: true,
        },
      admin && {
        title: adminContext ? t`Exit admin` : t`Admin`,
        icon: null,
        link: adminContext ? "/" : "/admin",
        event: `Navbar;Profile Dropdown;${
          adminContext ? "Exit Admin" : "Enter Admin"
        }`,
      },
      /*{
        title: t`Activity`,
        icon: null,
        link: "/activity",
        event: `Navbar;Profile Dropdown;Activity ${tag}`,
      },*/
      publicAnalyticPermission && {
        title: t`Public Analyst`,
        icon: null,
        link: "/collection/root",
        event: `Navbar;Profile Dropdown;Root`,
      },
      (isAdmin || isMarket) && {
        title: t`Upgrade Vip`,
        icon: null,
        link: "/market/upgrade",
        event: `Navbar;Profile Dropdown;upgrade`,
      },
      {
        title: t`Sign out`,
        icon: null,
        link: "auth/logout",
        event: `Navbar;Profile Dropdown;Logout`,
      },
    ].filter(Boolean);
  };

  render() {
    const { modalOpen } = this.state;
    // const adminContext = this.props.context === "admin";
    const { tag, date, ...versionExtra } = MetabaseSettings.get("version");
    // don't show trademark if application name is whitelabeled
    const showTrademark = t`Metabase` === "Metabase";
    return (
      <Box>
        <EntityMenu
          tooltip={t`Settings`}
          items={this.generateOptionsForUser()}
          triggerIcon="gear"
          triggerProps={{
            // hover: {
            //   backgroundColor: adminContext
            //     ? darken(color("accent7"))
            //     // : darken(color("brand")),
            //     : '#5F6368',
            //   color: "#fff",
            // },
            style: {
              color: "#5F6368",
            },
          }}
          homeSetting={true}
          {...this.props}
        />
        {modalOpen === "about" ? (
          <Modal small onClose={this.closeModal}>
            <div className="px4 pt4 pb2 text-centered relative">
              <div className="text-brand pb2">
                <LogoIcon height={48} />
              </div>
              <h2
                style={{ fontSize: "1.75em" }}
                className="text-dark"
              >{t`Thanks for using Metabase!`}</h2>
              <div className="pt2">
                <h3 className="text-dark mb1">
                  {t`You're on version`} {tag}
                </h3>
                <p className="text-medium text-bold">
                  {t`Built on`} {date}
                </p>
                {!/^v\d+\.\d+\.\d+$/.test(tag) && (
                  <div>
                    {_.map(versionExtra, (value, key) => (
                      <p key={key} className="text-medium text-bold">
                        {capitalize(key)}: {value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {showTrademark && (
              <div
                style={{ borderWidth: "2px" }}
                className="p2 h5 text-centered text-medium border-top"
              >
                <span className="block">
                  <span className="text-bold">Metabase</span>{" "}
                  {t`is a Trademark of`} Metabase, Inc
                </span>
                <span>{t`and is built with care in San Francisco, CA`}</span>
              </div>
            )}
          </Modal>
        ) : null}
      </Box>
    );
  }
}
