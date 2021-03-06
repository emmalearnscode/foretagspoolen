import React from "react";

import BaseButton from "../../base-button/base-button";

import "./modal-delete.scss";

const DeleteModal = ({ currentCompany, toggleModal, updateDBError }) => {
  return (
    <div className="delete-modal">
      <h3>
        Är du säker du vill radera {currentCompany.namn} helt från
        företagspoolen?
      </h3>
      <section className="buttons">
        <BaseButton
          color="danger"
          toggleModal={toggleModal}
          data={currentCompany}
        >
          JA - RADERA
        </BaseButton>
        <BaseButton color="grey" toggleModal={toggleModal}>
          AVBRYT
        </BaseButton>
      </section>
      {updateDBError ? <p className="error">{updateDBError}</p> : null}
    </div>
  );
};

export default DeleteModal;
