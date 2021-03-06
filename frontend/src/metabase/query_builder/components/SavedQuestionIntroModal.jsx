/* eslint-disable react/prop-types */
import React, { Component } from "react";

import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import { t } from "ttag";

export default class SavedQuestionIntroModal extends Component {
  render() {
    return (
      <Modal isOpen={this.props.isShowingNewbModal}>
        <ModalContent
          title={t`It's okay to play around with saved queries`}
          className="Modal-content text-centered py2"
        >
          <div className="px2 pb2 text-paragraph">
            {t`You won't make any permanent changes to a saved query unless you click Save and choose to replace the original chart.`}
          </div>
          <div className="Form-actions flex justify-center py1">
            <button
              data-metabase-event={"QueryBuilder;IntroModal"}
              className="Button Button--primary"
              onClick={() => this.props.onClose()}
            >
              {t`Okay`}
            </button>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
