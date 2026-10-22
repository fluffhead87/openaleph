import React, { Component } from 'react';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';

import withRouter from 'app/withRouter';
import { Collection } from 'components/common';
import collectionViewIds from 'components/Collection/collectionViewIds';
import DocumentUploadDialog from 'dialogs/DocumentUploadDialog/DocumentUploadDialog';
import { writeableDatasetsQuery } from 'queries';
import getCollectionLink from 'util/getCollectionLink';

const messages = defineMessages({
  title: {
    id: 'dataset.upload.title',
    defaultMessage: 'Upload documents to a dataset',
  },
  placeholder: {
    id: 'dataset.upload.placeholder',
    defaultMessage: 'Select a dataset',
  },
});

// Lets the user pick one of the datasets they can write to, then hands over
// to the regular document upload dialog for that dataset.
export class DatasetUploadDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { collection: null, uploadIsOpen: false };
    this.onSelect = this.onSelect.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.onUploadToggle = this.onUploadToggle.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
  }

  onSelect(collection) {
    this.setState({ collection });
  }

  onContinue() {
    this.setState({ uploadIsOpen: true });
  }

  onUploadToggle() {
    this.setState({ collection: null, uploadIsOpen: false });
    this.props.toggleDialog();
  }

  onUploadSuccess() {
    const { navigate } = this.props;
    const { collection } = this.state;
    navigate(
      getCollectionLink({ collection, mode: collectionViewIds.DOCUMENTS })
    );
  }

  render() {
    const { intl, isOpen, toggleDialog } = this.props;
    const { collection, uploadIsOpen } = this.state;

    if (uploadIsOpen) {
      return (
        <DocumentUploadDialog
          isOpen={isOpen}
          toggleDialog={this.onUploadToggle}
          collection={collection}
          onUploadSuccess={this.onUploadSuccess}
        />
      );
    }

    return (
      <Dialog
        icon="upload"
        className="DatasetUploadDialog"
        isOpen={isOpen}
        title={intl.formatMessage(messages.title)}
        onClose={toggleDialog}
      >
        <div className={Classes.DIALOG_BODY}>
          <div className={Classes.FORM_GROUP}>
            <div className={Classes.LABEL}>
              <FormattedMessage
                id="dataset.upload.collection"
                defaultMessage="Dataset"
              />
              <Collection.Select
                collection={collection}
                onSelect={this.onSelect}
                query={writeableDatasetsQuery()}
                icon="database"
                buttonProps={{
                  label: intl.formatMessage(messages.placeholder),
                }}
              />
              <div className={Classes.FORM_HELPER_TEXT}>
                <FormattedMessage
                  id="dataset.upload.helper"
                  defaultMessage="Only datasets you have been given write access to are listed. Ask an administrator if you need access to another dataset."
                />
              </div>
            </div>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              intent={Intent.PRIMARY}
              disabled={!collection}
              onClick={this.onContinue}
            >
              <FormattedMessage
                id="dataset.upload.continue"
                defaultMessage="Continue"
              />
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default compose(withRouter, injectIntl)(DatasetUploadDialog);
