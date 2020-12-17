import { ConfigProvider, Pagination, Table } from 'antd';
import { connect } from 'react-redux';
import I from 'components/I';
import React from 'react';
import TableLoadingSpin from 'components/TableLoadingSpin';
import WhyIcon from 'components/WhyIcon';
import styled, { withTheme } from 'styled-components';

import Moment from 'moment';

import {
  LargeTableRow,
  LargeTableRowFailed,
  LargeTableRowProcessed,
  LargeTableRowProcessing,
  SimpleTableContainer,
  TextCompactTableHeader,
} from 'styles/Styles';
import EmptyTableIndicator from 'components/EmptyTableIndicator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

import { getEtherscanLink } from 'lightcone/api/localStorgeAPI';

const StatusFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

class DepositTable extends React.Component {
  render() {
    const theme = this.props.theme;
    const customizeRenderEmpty = () => (
      <EmptyTableIndicator
        text={this.props.placeHolder}
        loading={this.props.loading}
      />
    );

    const columns = [
      {
        title: (
          <TextCompactTableHeader style={{ paddingLeft: '14px' }}>
            <I s="Timestamp" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'date',
        width: '14%',
      },
      {
        title: (
          <TextCompactTableHeader
            style={{
              paddingLeft: '14px',
            }}
          >
            <I s="Asset" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'asset',
        width: '18%',
      },
      {
        title: (
          <TextCompactTableHeader>
            <I s="Amount" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'amount',
        width: '20%',
      },
      /*
      {
        title: (
          <TextCompactTableHeader>
            <I s="Fee" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'fee',
        width: '14%',
      },
      */
      {
        title: (
          <TextCompactTableHeader>
            <I s="Tx Hash" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'txHash',
        width: '20%',
      },
      /*
      {
        title: (
          <TextCompactTableHeader>
            <I s="Type" />
          </TextCompactTableHeader>
        ),
        dataIndex: 'depositType',
        width: '10%',
      },
      */
      {
        title: (
          <TextCompactTableHeader
            style={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                textAlign: 'left',
                paddingRight: '14px',
              }}
            >
              <I s="Status" />
            </div>
          </TextCompactTableHeader>
        ),
        dataIndex: 'status',
        width: '20%',
      },
    ];

    const data = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const transaction = this.props.data[i];
      var status = '-';
      if (transaction.status === 'TX_STATUS_PROCESSING') {
        status = (
          <LargeTableRowProcessing
            style={{ color: theme.highlight, textAlign: 'left' }}
          >
            <StatusFontAwesomeIcon icon={faCircleNotch} spin />
            <div>
              <I s="Processing" /> <WhyIcon text="StatusProcessing" />
            </div>
          </LargeTableRowProcessing>
        );
      } else if (transaction.status === 'TX_STATUS_PROCESSED') {
        status = (
          <LargeTableRowProcessed
            style={{ color: theme.green, textAlign: 'left' }}
          >
            <StatusFontAwesomeIcon icon={faCheckCircle} />
            <div>
              <I s="Succeeded" />
            </div>
          </LargeTableRowProcessed>
        );
      } else if (transaction.status === 'TX_STATUS_FAILED') {
        status = (
          <LargeTableRowFailed style={{ color: theme.red, textAlign: 'left' }}>
            <StatusFontAwesomeIcon icon={faExclamationCircle} />
            <div>
              <I s="Failed" />
            </div>
          </LargeTableRowFailed>
        );
      } else if (transaction.status === 'TX_STATUS_RECEIVED') {
        status =
          this.props.blockNum - transaction.blockNum <= 30 ? (
            <LargeTableRowProcessing
              style={{ color: theme.orange, textAlign: 'left' }}
            >
              <StatusFontAwesomeIcon icon={faClock} />
              <div>
                <I s="Confirming" />
                {/* (
                {Math.max(this.props.blockNum - transaction.blockNum, 0)} / 18) */}
                <WhyIcon text="StatusConfirmingDeposit" />
              </div>
            </LargeTableRowProcessing>
          ) : (
            <LargeTableRowProcessing
              style={{ color: theme.highlight, textAlign: 'left' }}
            >
              <StatusFontAwesomeIcon icon={faCircleNotch} spin />
              <div>
                <I s="Processing" /> <WhyIcon text="StatusProcessing" />
              </div>
            </LargeTableRowProcessing>
          );
      }

      // No deposit type in 3.6
      /*
      if (transaction.depositType === 'deposit') {
        type = <I s="Deposit" />;
      } else if (transaction.depositType === 'update_account') {
        type = <I s="Reset Layer-2 Keypair" />;
      } else {
        type = <I s="Activate Layer-2" />;
      }
      */

      data.push({
        key: i,
        asset: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
            }}
          >
            {' '}
            {transaction.tokenName &&
            transaction.tokenName.split('-').length - 1 >= 2 ? (
              <div>{transaction.symbol}</div>
            ) : (
              <div>
                {transaction.symbol} - <I s={transaction.tokenName} />{' '}
              </div>
            )}
          </LargeTableRow>
        ),
        amount: (
          <LargeTableRow>
            {transaction.amountInUI} {transaction.symbol}
          </LargeTableRow>
        ),
        /*
        fee: (
          <LargeTableRow
            style={{
              color: theme.textDim,
            }}
          >
            {transaction.feeInUI} ETH
          </LargeTableRow>
        ),
        */
        date: (
          <LargeTableRow
            style={{
              paddingLeft: '14px',
              color: theme.textDim,
            }}
          >
            {Moment(transaction.timestamp).format(theme.timeFormat)}
          </LargeTableRow>
        ),
        txHash: (
          <LargeTableRow>
            <a
              href={`${getEtherscanLink(this.props.chainId)}/tx/${
                transaction.txHash
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transaction.txHashInUI}
            </a>
          </LargeTableRow>
        ),
        status: (
          <div
            style={{
              textAlign: 'center',
              paddingRight: '14px',
            }}
          >
            {status}
          </div>
        ),
        // depositType: <LargeTableRow>{type}</LargeTableRow>,
      });
    }

    const hasPagination = this.props.total > this.props.limit;

    return (
      <SimpleTableContainer>
        <ConfigProvider renderEmpty={data.length === 0 && customizeRenderEmpty}>
          <TableLoadingSpin loading={this.props.loading}>
            <Table
              style={{
                height: `${data.length * 34 + 35}px`,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y: `${data.length * 34}px`,
              }}
            />
          </TableLoadingSpin>
          {hasPagination ? (
            <Pagination
              style={{
                padding: '30px 0px 30px 0px',
                background: theme.background,
                textAlign: 'center',
              }}
              size=""
              total={this.props.total}
              current={this.props.current}
              onChange={this.props.onChange}
              pageSize={this.props.limit}
            />
          ) : (
            <div />
          )}
        </ConfigProvider>
      </SimpleTableContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { exchange, notifyCenter } = state;
  return { chainId: exchange.chainId, blockNum: notifyCenter.blockNum };
};

export default withTheme(connect(mapStateToProps, null)(DepositTable));
