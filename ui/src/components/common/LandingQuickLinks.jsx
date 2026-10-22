import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import withRouter from 'app/withRouter';
import { queryCollections } from 'actions';
import { QuickLinks } from 'components/common';
import { DialogToggleButton } from 'components/Toolbar';
import DatasetUploadDialog from 'dialogs/DatasetUploadDialog/DatasetUploadDialog';
import { writeableDatasetsQuery } from 'queries';
import { selectCollectionsResult } from 'selectors';

class LandingQuickLinks extends React.Component {
  componentDidMount() {
    this.fetchIfNeeded();
  }

  componentDidUpdate() {
    this.fetchIfNeeded();
  }

  fetchIfNeeded() {
    const { datasetsQuery, datasetsResult } = this.props;
    if (datasetsResult.shouldLoad) {
      this.props.queryCollections({ query: datasetsQuery });
    }
  }

  render() {
    const { datasetsResult } = this.props;
    const canUploadToDataset = datasetsResult.total > 0;

    return (
      <QuickLinks>
        <Link to="/search" className="QuickLinks__item">
          <div className="QuickLinks__item__content">
            <div className="QuickLinks__item__icon">
              <img src="/static/1F50D.svg" alt="" />
            </div>
            <div className="QuickLinks__item__text">
              <p>
                <FormattedMessage
                  id="landing.shortcut.search"
                  defaultMessage="Search entities"
                />
              </p>
            </div>
          </div>
        </Link>
        <Link to="/datasets" className="QuickLinks__item">
          <div className="QuickLinks__item__content">
            <div className="QuickLinks__item__icon">
              <img src="/static/1F5C3.svg" alt="" />
            </div>
            <div className="QuickLinks__item__text">
              <p>
                <FormattedMessage
                  id="landing.shortcut.datasets"
                  defaultMessage="Browse datasets"
                />
              </p>
            </div>
          </div>
        </Link>
        <Link to="/investigations" className="QuickLinks__item">
          <div className="QuickLinks__item__content">
            <div className="QuickLinks__item__icon">
              <img src="/static/1F52C.svg" alt="" />
            </div>
            <div className="QuickLinks__item__text">
              <p>
                <FormattedMessage
                  id="landing.shortcut.investigation"
                  defaultMessage="Start an investigation"
                />
              </p>
            </div>
          </div>
        </Link>
        {canUploadToDataset && (
          <div className="QuickLinks__item">
            <DialogToggleButton
              buttonProps={{
                minimal: true,
                className: 'QuickLinks__item__content',
              }}
              Dialog={DatasetUploadDialog}
            >
              <>
                <div className="QuickLinks__item__icon">
                  <img src="/static/1F4E4.svg" alt="" />
                </div>
                <div className="QuickLinks__item__text">
                  <p>
                    <FormattedMessage
                      id="landing.shortcut.dataset_upload"
                      defaultMessage="Upload to a dataset"
                    />
                  </p>
                </div>
              </>
            </DialogToggleButton>
          </div>
        )}
        <Link to="/alerts" className="QuickLinks__item">
          <div className="QuickLinks__item__content">
            <div className="QuickLinks__item__icon">
              <img src="/static/1F514.svg" alt="" />
            </div>
            <div className="QuickLinks__item__text">
              <p>
                <FormattedMessage
                  id="landing.shortcut.alert"
                  defaultMessage="Create a search alert"
                />
              </p>
            </div>
          </div>
        </Link>
      </QuickLinks>
    );
  }
}

const mapStateToProps = (state) => {
  const datasetsQuery = writeableDatasetsQuery();
  return {
    datasetsQuery,
    datasetsResult: selectCollectionsResult(state, datasetsQuery),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { queryCollections }),
  injectIntl
)(LandingQuickLinks);
