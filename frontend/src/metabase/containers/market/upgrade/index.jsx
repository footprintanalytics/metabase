/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { getUser } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";
import { Input } from "antd";
import VipList from "metabase/containers/market/upgrade/compoment/VipList";
import "./index.css";
import "../picture/index.css";
import { getUserVipInfo } from "metabase/new-service";

const Upgrade = props => {
  const { user, vip, router } = props;

  const [searchText, setSearchText] = useState();
  const [current, setCurrent] = useState(1);

  const onSearch = text => {
    setSearchText(text);
    setCurrent(1);
  };

  if (user && !user.isMarket) {
    return (
      <div className="market__nodata">
        No content displayed, please contact the administrator
      </div>
    );
  }

  return (
    <div className="upgrade">
      <Input.Search
        placeholder="Please input email"
        onSearch={onSearch}
        style={{ width: 400, padding: "0 20px" }}
      />
      <VipList
        user={user}
        vip={vip}
        router={router}
        searchText={searchText}
        setCurrent={setCurrent}
        current={current}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  user: getUser(state),
  vip: getUserVipInfo(state),
});

export default connect(mapStateToProps)(Upgrade);
