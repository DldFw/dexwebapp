import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { Button, Col, Popover, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdjust } from '@fortawesome/free-solid-svg-icons/faAdjust';
import { faBrush } from '@fortawesome/free-solid-svg-icons/faBrush';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCoins } from '@fortawesome/free-solid-svg-icons/faCoins';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons/faGlobeAsia';

import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';

import { tracker } from 'components/DefaultTracker';

import {
  selectCurrency,
  selectLanguage,
  selectTheme,
} from 'redux/actions/UserPreferenceManager';
import { updateLegal } from 'redux/actions/LegalPrice';
import { withUserPreferences } from 'components/UserPreferenceContext';

const OptionButton = styled(Button)`
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  border: none !important;
  background-color: ${(props) => props.theme.buttonBackground}!important;
  margin: 16px 8px;
  padding: 0;
  border-radius: 4px;
  height: 24px;
  width: 24px;
  color: ${(props) => props.theme.textBigButton}!important;
  border: none !important;
  &[disabled],
  &:hover {
    border: none;
    background-color: ${(props) => props.theme.primary}!important;
  }
  &[disabled] {
    color: ${(props) => props.theme.textBigButton}!important;
  }
`;

const SettingFontAwesomeIcon = styled.div`
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.sidePanelBackground};

  &:hover {
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.buttonBackground} !important;
    background-color: ${(props) => props.theme.buttonBackground} !important;

    // Change svg color
    // svg path {
    //   fill: ${(props) => props.theme.sidePanelBackground} !important;
    // }
  }
`;

var autoThemeJob = null;

class SettingsPopover extends React.Component {
  changeLanguage = (value) => {
    if (value === 'en' || value === 'zh') {
      this.props.selectLanguage(value);
    }
  };

  changeCurrency = (value) => {
    if (value === 'CNY' || value === 'USD') {
      this.props.updateLegal(value, 'BAND');
      this.props.selectCurrency(value);
    }
  };

  selectTheme = (themeName) => {
    if (autoThemeJob) {
      clearTimeout(autoThemeJob);
      autoThemeJob = null;
    }

    this.props.selectTheme(themeName);

    if (themeName === 'auto') {
      autoThemeJob = setTimeout(() => {
        this.selectTheme('auto');
      }, 30 * 60 * 1000); // 30 minutes
    }
  };

  render() {
    const theme = this.props.theme;
    const userPreferences = this.props.userPreferences;
    const themeName = userPreferences.themeName;
    const language = userPreferences.language;
    const currency = userPreferences.currency;
    const content = (
      <div style={{ minWidth: '360px' }}>
        <Row type="flex" justify="space-between">
          <Col span={4}>
            <FontAwesomeIcon
              icon={faGlobeAsia}
              style={{
                width: '24px',
                height: '24px',
                color: theme.textWhite,
              }}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                fontSize: '1rem',
                color: theme.textWhite,
              }}
            >
              <I s="Language" />
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: theme.textDim,
                margin: '8px 0px',
              }}
            >
              <I s="Change the default interface language" />
            </div>
          </Col>
          <Col span={2}>
            <OptionButton
              disabled={language === 'en'}
              size="small"
              onClick={() => {
                this.changeLanguage('en');

                tracker.trackEvent({
                  type: 'CHANGE_LANGUAGE',
                  data: {
                    lang: 'en',
                  },
                });
              }}
            >
              En
            </OptionButton>
          </Col>
          <Col span={2}></Col>
          <Col span={2}>
            <OptionButton
              disabled={language === 'zh'}
              size="small"
              onClick={() => {
                this.changeLanguage('zh');

                tracker.trackEvent({
                  type: 'CHANGE_LANGUAGE',
                  data: {
                    lang: 'zh',
                  },
                });
              }}
            >
              中
            </OptionButton>
          </Col>
        </Row>
        <Row
          type="flex"
          style={{
            borderTop: '1px solid ' + theme.seperator,
            paddingTop: '12px',
          }}
          justify="space-between"
        >
          <Col span={4}>
            <FontAwesomeIcon
              icon={faCoins}
              style={{
                width: '24px',
                height: '24px',
                color: theme.textWhite,
              }}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                fontSize: '1rem',
                color: theme.textWhite,
              }}
            >
              <I s="Currency" />
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: theme.textDim,
                margin: '8px 0px',
              }}
            >
              <I s="Change the default currency" />
            </div>
          </Col>
          <Col span={2}>
            <OptionButton
              style={{
                width: '36px',
              }}
              disabled={currency === 'USD'}
              size="small"
              onClick={() => {
                this.changeCurrency('USD');
                tracker.trackEvent({
                  type: 'CHANGE_CURRENCY',
                  data: {
                    currency: 'usd',
                  },
                });
              }}
            >
              <I s="USD" />
            </OptionButton>
          </Col>
          <Col
            span={4}
            style={{
              textAlign: 'right',
            }}
          >
            <OptionButton
              style={{
                width: '36px',
                marginRight: '-2px',
              }}
              disabled={currency === 'CNY'}
              size="small"
              onClick={() => {
                this.changeCurrency('CNY');

                tracker.trackEvent({
                  type: 'CHANGE_CURRENCY',
                  data: {
                    currency: 'cny',
                  },
                });
              }}
            >
              <I s="CNY" />
            </OptionButton>
          </Col>
        </Row>
        <Row
          type="flex"
          style={{
            borderTop: '1px solid ' + theme.seperator,
            paddingTop: '12px',
          }}
          justify="space-between"
        >
          <Col span={4}>
            <FontAwesomeIcon
              icon={faBrush}
              style={{
                width: '24px',
                height: '24px',
                color: theme.textWhite,
              }}
            />
          </Col>
          <Col span={14}>
            <div
              style={{
                fontSize: '1rem',
                color: theme.textWhite,
              }}
            >
              <I s="Theme" />
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: theme.textDim,
                margin: '8px 0px',
              }}
            >
              <I s="Choose between dark and light theme" />
            </div>
          </Col>
          <Col span={2}>
            <OptionButton
              disabled={themeName === 'light'}
              size="small"
              icon={<FontAwesomeIcon icon={faSun} />}
              style={{
                borderRadius: '50%',
              }}
              onClick={() => {
                this.selectTheme('light');

                tracker.trackEvent({
                  type: 'CHANGE_THEME',
                  data: {
                    themeName: 'light',
                  },
                });
              }}
            />
          </Col>
          <Col span={2} align="center">
            <OptionButton
              disabled={themeName === 'dark'}
              size="small"
              icon={<FontAwesomeIcon icon={faMoon} />}
              style={{
                borderRadius: '50%',
              }}
              onClick={() => {
                this.selectTheme('dark');

                tracker.trackEvent({
                  type: 'CHANGE_THEME',
                  data: {
                    themeName: 'dark',
                  },
                });
              }}
            />
          </Col>
          <Col span={2}>
            <OptionButton
              disabled={themeName === 'auto'}
              size="small"
              icon={<FontAwesomeIcon icon={faAdjust} />}
              style={{
                borderRadius: '50%',
              }}
              onClick={() => {
                this.selectTheme('auto');

                tracker.trackEvent({
                  type: 'CHANGE_THEME',
                  data: {
                    themeName: 'auto',
                  },
                });
              }}
            />
          </Col>
        </Row>
      </div>
    );
    return (
      <Popover
        placement={'bottomLeft'}
        mouseLeaveDelay={0.2}
        content={content}
        title={<I s="Settings" />}
        trigger="click"
        visible={this.props.visible}
        onVisibleChange={this.props.onVisibleChange}
      >
        <SettingFontAwesomeIcon
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '32px',
            marginTop: '12px',
            marginBottom: '12px',
            backgroundColor: this.props.theme.sidePanelBackground,
          }}
        >
          <FontAwesomeIcon
            icon={faCog}
            style={{
              width: '32px',
              height: '14px',
              paddingRight: '8px',
              paddingLeft: '8px',
              color: this.props.theme.textDim,
            }}
          />
        </SettingFontAwesomeIcon>
      </Popover>
    );
  }
}

const mapStateToProps = (state) => {
  const { pathname } = state.router.location;
  return {
    pathname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectLanguage: (language) => dispatch(selectLanguage(language)),
    selectCurrency: (currency) => dispatch(selectCurrency(currency)),
    selectTheme: (themeName) => dispatch(selectTheme(themeName)),
    updateLegal: (legal, source) => dispatch(updateLegal(legal, source)),
  };
};

export default withUserPreferences(
  withTheme(connect(mapStateToProps, mapDispatchToProps)(SettingsPopover))
);
